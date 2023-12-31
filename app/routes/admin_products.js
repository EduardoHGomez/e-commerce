const express = require('express');
const path = require('path');
const dataHandlerFile = require(path.resolve(__dirname + '/../controllers/data_handler.js'));
const Product = require(path.resolve(__dirname + '/../controllers/product.js'));

const router = express.Router();

// admin/products
router.post('/products', (req, res) => {
    let result = {};
    res.setHeader('Content-Type', 'application/json');
    body = req.body;

    // Detectar si tienen los atributos que nos interesan
    const validAttributes = 
    ['uuid', 'title', 'description', 'imageUrl', 'unit', 'stock', 'pricePerUnit', 'category'];
    let areAllValid = true;

    validAttributes.forEach((key) => {
        if(body[key] === undefined) {
            // Entra en esta condición si el body le hace falta uno de los atributos
            areAllValid = false;
            res.statusCode = 400;
            result = {'message': 'Atributos incompletos!'}
        }
    });

    if(areAllValid) { // Si el request tiene todos los atributos
        // Detectar si el producto ya existe (con base en el uuid)
        const uuid = req.body['uuid'];
        const found = dataHandlerFile.getProductsById(uuid);
        if(found != false) { // El producto ya existe
            res.statusCode = 400;
            result = {'message': `Producto con uuid ${uuid} ya existe`};
        } else { // Si es false, entonces no encontró y se puede crear el producto
            res.statusCode = 201;
            let new_product = dataHandlerFile.createProduct(req.body);
            result = {'message': 'Producto cargado con exitosamente'};
        }

    }

    res.send(result);
});

// admin/products/:id
router.put('/products/:id', (req, res) => {
    let result = {};
    res.setHeader('Content-Type', 'application/json');

    body = req.body;
    // Detectar si tienen los atributos que nos interesan
    const validAttributes = 
    ['title', 'description', 'imageUrl', 'unit', 'stock', 'pricePerUnit', 'category'];
    let areAllValid = true;

    validAttributes.forEach((key) => {
        if(body[key] === undefined) {
            // Entra en esta condición si el body le hace falta uno de los atributos
            areAllValid = false;
            res.statusCode = 400;
            result = {'message': 'Atributos incompletos!'}
        }
    });

    if (areAllValid) {
        // Primero detectar que si el producto no existe, entonces regresar 404
        const uuid = req.params.id;
        const found = dataHandlerFile.getProductsById(uuid);

        if (!found) { // Cuando el producto no se encontró
            res.statusCode = 404;
            result = {'message': 'Producto no encontrado'};
        } else { // Cuando el producto sí se encontró
            res.statusCode = 200;
            new_data = req.body;
            dataHandlerFile.updateProduct(uuid, new_data);
            result = {'message': `Producto ${new_data['title']}`}
        }
    }



    res.send(result);

});

// admin/products/:id
router.delete('/products/:id', (req, res) => {
    let result = {};
    res.setHeader('Content-Type', 'application/json');
    // Primero detectar que si el producto no existe, entonces regresar 404
    const uuid = req.params.id;
    const found = dataHandlerFile.getProductsById(uuid);

    if (!found) {
        res.statusCode = 404;
        result = {'message': 'Producto no encontrado'};
    } else {
        const deletedProduct = dataHandlerFile.deleteProduct(uuid);
        res.statusCode = 200;
        result = {'message': `Producto ${deletedProduct} eliminado`};
    }

    res.send(result);

});


module.exports = router;