const { Client } = require('pg');

const { dbOptions } = require('../helpers/dbOptions');

const handlerProductsById = (product = {}, status = 200) => ( 
  {
    headers: {
      "Access-Control-Allow-Headers" : "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET"
    },
    statusCode: status,
    body: JSON.stringify(product),
  }
);

const getProductsById = async (event) => {
  const productId = event.pathParameters.productId || null;
  const client = new Client(dbOptions);
  await client.connect();
  try {
    const {rows: products} = await client.query(`SELECT * FROM products WHERE id = '${productId}'`);
    if(!products || !products.length) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: `Product with id ${productId} not found`,
        }),
      }
    };
    return await handlerProductsById(products[0], 200);

  } catch (error) {
    console.error('Error: ' + error);

  } finally {
    client.end();
  }
}

module.exports = {
  getProductsById
}
