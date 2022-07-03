const AWS = require('aws-sdk');
const csvParser = require('csv-parser');
const BUCKET = 'arn:aws:s3:::uploaded-alhladkiy';

const importProductsFile = async function(event) {
    const s3 = new AWS.S3({ region: 'eu-central-1' });
    let statusCode = 200;
    let body = {};
    const file = event.queryStringParameters.name;
    const catalog = `uploaded/${file}`;

    const params = {
      Bucket: BUCKET,
      Key: catalog,
      Expires: 60,
      ContentType: 'text/csv',
    };

    try {
      const signedURL = await new Promise((reject, resolve) => {
        return  s3.getSignedUrl('putObject', params, (err, url) => {
          if (err || !url) {
            console.log('You have error!!!');
            reject(err);
          }
          resolve(url);
        });
      });
        body = JSON.stringify({signedURL});

    } catch (error) {
      console.error('Error: ', error);
      statusCode = 500;
      body = error;
    }

    return {
      statusCode,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body,
    };
  }

  const importFileParser = async function(event) {
    const s3 = new AWS.S3({ region: 'eu-west-1' });
    let statusCode = 202;
    let body = {};

    for (const record of event.Records) {

      try {
        const params = {
          Bucket: BUCKET,
          Key: record.s3.object.key,
        };
        const s3Stream = s3.getObject(params).createReadStream();
        await new Promise((resolve, reject) => {
          s3Stream
            .pipe(csvParser())
            .on('data', (chunk) => {
              console.log(chunk);
            })
            .on('error', (err) => {
              reject(err);
            })
          .on('end', async () => {
            console.log(`Copy in ${BUCKET}/${record.s3.object.key.replace('uploaded', 'parsed')}`);

            await s3.copyObject({
              Bucket: BUCKET,
              CopySource: BUCKET + '/' + record.s3.object.key,
              Key: record.s3.object.key.replace('uploaded', 'parsed')
            }).promise();

            await s3.deleteObject({
              Bucket: BUCKET,
              Key: record.s3.object.key
            }).promise();

            resolve(() => {});
          });
        });

      } catch (error) {
        console.error('Your err:', error);
        statusCode = 500;
        body = error;
      }
    }

    return {
      statusCode,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body,
    }
  }


  module.exports = {
    importProductsFile,
    importFileParser
  }