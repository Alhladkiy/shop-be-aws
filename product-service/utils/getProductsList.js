const { Client } = require('pg');

const { dbOptions } = require('../helpers/dbOptions');

const getProducts = (products = {}, status = 200) => (
  {
    headers: {
      "Access-Control-Allow-Headers" : "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS, POST, GET"
    },
    statusCode: status,
    body: JSON.stringify(products),
  }
);
    
const handlerProductsList = async (event) => {
  const client = new Client(dbOptions);
  await client.connect();

  try {
    const { rows: product } = await client.query(`select * from products`);
    return await getProducts(product, 200);

  } catch (err) {
    console.error('Error: ', err);

  } finally {
    client.end();
  }
}

module.exports = {
  handlerProductsList
}




