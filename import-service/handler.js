const AWS = require('aws-sdk');
const csvParser = require('csv-parser');

const BUCKET = 'uploaded-alhladkiy';
const sqs = new AWS.SQS();

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
  const res = [];

  try {
    for (const record of event.Records) {
      const key = record.s3.object.key;

      const param = {
        Bucket: BUCKET,
        Key: key,
      }
      const s3Stream = s3.getObject(param).createReadStream();           
      await new Promise((resolve, reject) => {
          s3Stream
          .pipe(csvParser())
          .on('data', (data) => 
          sqs.sendMessage({
            QueueUrl: process.env.SQS_URL,
            MessageBody: data
          }, () => console.log('message sent:', data)).promise())
          callback(null, {
            statusCode: 200,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Credentials": true,
            },
          })
          .on('error', (error) => {
              reject(error);
          })
          .on('end', async () => { 
            res.forEach((data) => {
              console.log('!!!!!!!', data);
              
            })
            await sendMessage(data);

            await 

            await s3.copyObject({
              Bucket: BUCKET,
              CopySource: `${BUCKET}/${key}`,
              Key: key.replace('uploaded', 'parsed_file')
            }).promise();
            console.log(`Copying was successful`);
  
            await s3.deleteObject({
              Bucket: BUCKET,
              Key: key
            }).promise();
            console.log('file delete')

              resolve( async()=> {    
                  console.log('resolve!!!!')
              });
          });   
      });

      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify(res),
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

const catalogBatchProcess = async (event) => {
  
  console.log(event)

  return {
      statusCode: 200,
      body: JSON.stringify('hello, your message send')
  }
}

module.exports = {
  importProductsFile,
  importFileParser,
  catalogBatchProcess
}