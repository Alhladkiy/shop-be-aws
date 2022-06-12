'use strict';

// const products = require('./mock/products');

const products = [
  {
    "count": 4,
    "description": "professional boots",
    "id": "7567ec4b-b10c-48c5-9345-fc73c48a80aa",
    "price": 240.00,
    "title": "Nike Phantom GT2 Elite FG",
    "img": "https://soccershop.by/image/cache/catalog/Footwear/Nike/new/FirmGround/DA4432-167_2-1024x1024.jpg"
  },
  {
    "count": 6,
    "description": "professional boots",
    "id": "7567ec4b-b10c-48c5-9345-fc73c48a80a0",
    "price": 600.000,
    "title": "Nike Mercurial Superfly 8",
    "img": "https://soccershop.by/image/cache/catalog/Footwear/Nike/new/FirmGround/cv0958-760_1-1024x1024.jpg"

  },
  {
    "count": 7,
    "description": "semi-professional boots",
    "id": "7567ec4b-b10c-48c5-9345-fc73c48a80a2",
    "price": 230.00,
    "title": "Nike Phantom GT2 Elite FG",
    "img": "https://soccershop.by/image/cache/catalog/Footwear/Nike/new/FirmGround/cz9890-004_g01-1024x1024.jpg"
  },
  {
    "count": 12,
    "description": "professional boots",
    "id": "7567ec4b-b10c-48c5-9345-fc73c48a80a1",
    "price": 260.00,
    "title": "Nike Phantom GT Elite FG",
    "img": "https://soccershop.by/image/cache/catalog/Footwear/Nike/new/FirmGround/unnamed-1024x1024.jpg"
  },
  {
    "count": 7,
    "description": "semi-professional boots",
    "id": "7567ec4b-b10c-48c5-9345-fc73c48a80a3",
    "price": 360.00,
    "title": "Nike Mercurial Vapor 14",
    "img": "https://soccershop.by/image/cache/catalog/Footwear/Nike/new/FirmGround/unnamed31414-1024x1024.jpg"

  },
  {
    "count": 8,
    "description": "professional boots",
    "id": "7567ec4b-b10c-48c5-9345-fc73348a80a1",
    "price": 340.00,
    "title": "Nike Mercurial Vapor 14",
    "img": " https://soccershop.by/image/cache/catalog/Footwear/Nike/new/FirmGround/f6h-jjEaqk8-1024x1024.jpg"
  },
  {
    "count": 2,
    "description": "semi-professional boots",
    "id": "7567ec4b-b10c-48c5-9445-fc73c48a80a2",
    "price": 230.00,
    "title": "Nike Mercurial Vapor 14",
    "img": " https://soccershop.by/image/cache/catalog/Footwear/Nike/new/FirmGround/CQ7635-105-1024x1024.jpg"
  },
  {
    "count": 3,
    "description": "semi-professional boots",
    "id": "7567ec4b-b10c-45c5-9345-fc73c48a80a1",
    "price": 395.00,
    "title": "Nike Phantom GT Elite SE",
    "img": "https://soccershop.by/image/cache/catalog/Footwear/Nike/new/FirmGround/data-images-butsi-nike-ct2156-001-693x465-1024x1024.jpg"
  }
];

module.exports.getProductsList = async (event) => {
    return {
        statusCode: 200,
        body: JSON.stringify(products),
        headers: {
          "Access-Control-Allow-Headers" : "Content-Type",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET"
        },
  };
}

module.exports.getProductsById = async (event) => {
    const id = products.find((item) => {
      return item.id === event.pathParameters.productId;
    })
      return {
        statusCode: 200,
        body: JSON.stringify(id),
        headers: {
          "Access-Control-Allow-Headers" : "Content-Type",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET"
        },
      };
}
