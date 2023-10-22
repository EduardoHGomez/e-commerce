const express = require('express');
const path = require('path');
const dataHandlerFile = require(path.resolve(__dirname + '/../controllers/data_handler.js'));
const Product = require(path.resolve(__dirname + '/../controllers/product.js'));

const router = express.Router();

// admin/products
router.post('/products', (req, res) => {
    res.statusCode = 201;
    let new_product = dataHandlerFile.createProduct(req.body);


    res.send({'message': 'Producto cargado'});
    
});


module.exports = router;