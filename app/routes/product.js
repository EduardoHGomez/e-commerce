const express = require('express');
const path = require('path');

const ShoppingCart = require('../controllers/shopping_cart.js');
const dataHandlerFile = require(path.resolve(__dirname + '/../controllers/data_handler.js'));

const router = express.Router();

// --------------- RUTAS ----------------
router.get('/', (req, res) => {
    var data = dataHandlerFile.getProducts();
    res.status(200).send(data);
});

// products/id
router.get('/:id', (req, res) => {
    let result = {}; // JSON explicando razón del status 
    var query = req.params.id;
    var data = dataHandlerFile.getProductsById(query);

    // Si no existe el id
    if (!data){
        res.statusCode = 404;
        result = {'message': 'uuid No encontrado!'};
    } else {
        res.statusCode = 200;
        result = data;
    }

    res.send(result);

});

// products/cart
router.post('/cart', (req, res) => {
    body = req.body; // Primero extraer body
    let result = {'message': 'Todo bien'}; // Variable para enviar desde el servidor

    // Comprobar si es arreglo
    if (Array.isArray(body) == false) {
        res.statusCode = 400;
        result = {'message': 'No es un arreglo!'};
    }

    // Comprobar que el uuid existe
    // 1. Del arreglo de Objetos, extraer y almacenar los uuids
    const uuids = body.map(obj => obj.uuid);

    // 2. Buscar si alguno de los uuids no existe. Si se cumple, regresar 404
    carrito = new ShoppingCart();
    const areUuidsValid = carrito.validateUuids(uuids);

    if (areUuidsValid === true) {
        result = {'message': 'Todos los productos se encuentran en el arrelgo :)'};
    } else {
        res.statusCode = 404;
        result = {'message': `Producto con uuid ${areUuidsValid} no existe!`};
    }

    // Hasta este punto todo bien, por lo tanto regresar el arreglo
    res.status(200).send(body);

});

module.exports = router;
