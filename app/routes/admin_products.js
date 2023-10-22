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
    let result = {'message': 'Producto actualizado'};
    // Primero detectar que si el producto no existe, entonces regresar 400
    const uuid = req.params.id;
    const found = dataHandlerFile.getProductsById(uuid);

    if (!found) {
        res.statusCode = 404;
        result = {'message': 'Producto no encontrado'};
    } else {
        res.statusCode = 200;
        new_data = req.body;
        dataHandlerFile.updateProduct(uuid, new_data);
    }

    res.send(result);

});


module.exports = router;