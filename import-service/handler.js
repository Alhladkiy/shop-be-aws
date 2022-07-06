const AWS = require('aws-sdk');
const csvParser = require('csv-parser');

const BUCKET = 'uploaded-alhladkiy';

const importProductsFile = async (event) => {
  const s3 = new AWS.S3({ region: 'eu-central-1' });
  
  const { name } = event.queryStringParameters;

  const catalogPath = `uploaded/${name}`;

  const params = {
    Bucket: BUCKET,
    Key: catalogPath,
    Expires: 60,
    ContentType: 'text/csv',
  };

  try {
    const signedURL = await new Promise((resolve, reject) => {
      return  s3.getSignedUrl('putObject', params, (error, url) => {
        console.log(error, url)
        if (error || !url) {
          reject(error);
        }
        resolve(url);
      });
    });
    
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Headers" : "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET"
      },
      body: JSON.stringify({
        url: signedURL
      })
    };

  } catch (error) {
    console.error('Error: ', error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        message: `Invalid error sorry`,
      }),
    };
  }
}

const importFileParser = async (event) => {
  const s3 = new AWS.S3({ region: 'eu-central-1' });

  try {
    for (const record of event.Records) {
      const key = record.s3.object.key;

      const params = {
        Bucket: BUCKET,
        Key: key,
      };
      await new Promise((resolve, reject) => {
        const s3Stream = s3.getObject(params).createReadStream();
        s3Stream
          .pipe(csvParser())
          .on('data', (data) => {
            console.log(data);
          })
          .on('error', (err) => {
            reject(err);
          })
        .on('end', async () => {
          console.log(`Copying was successful`);

          await s3.copyObject({
            Bucket: BUCKET,
            CopySource: `${BUCKET}/${key}`,
            Key: key.replace('uploaded', 'parsed_file')
          }).promise();

          await s3.deleteObject({
            Bucket: BUCKET,
            Key: key
          }).promise();
          console.log('file delete')

          resolve();
        });
      });
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify(data),
      };
    }
  } catch (error) {
    console.error('Error: ', error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        message: "Error!!!!",
      }),
    };
  }
}

  module.exports = {
    importProductsFile,
    importFileParser
  }