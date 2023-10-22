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

// admin/products/:id
router.put('/products/:id', (req, res) => {
    // Primero detectar que si el producto no existe, entonces regresar 400
    var uuid = req.body['uuid'];
    console.log(uuid);
    // var found = dataHandlerFile.getProductsById(uuid);

    res.statusCode = 201;
    res.send({'message': 'Producto actualizado'});
});


module.exports = router;