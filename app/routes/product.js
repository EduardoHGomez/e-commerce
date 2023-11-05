const express = require('express');
const path = require('path');

const ShoppingCart = require('../controllers/shopping_cart.js');
const dataHandlerFile = require(path.resolve(__dirname + '/../controllers/data_handler.js'));

const router = express.Router();

// --------------- RUTAS ----------------
router.get('/', (req, res) => {
    let result = {};
    res.setHeader('Content-Type', 'application/json');

    // Obtener params
    let params = req.query;

    // Si no tiene query, entonces regresar todos los productos
    if (Object.keys(params).length === 0) {
        var data = dataHandlerFile.getProducts();
        res.statusCode = 200;
        result = data;
    }  else if (params.page) {
        var page = parseInt(params.page);
        var paginatorResult = {
            'products': [],
            'current_page': 0
        };

        // -------- Paginator algorithm -----------

        // Función para el Paginator
        var data = dataHandlerFile.getProducts();
        var lower_limit = page * 4;
        var upper_limit = lower_limit + 4;

        if (upper_limit > data.length) {
            // Si el máximo se sale de la cantidad de items, actualizar 
            upper_limit = data.length;
        }

        // De todo el arreglo de data, obtener desde el límite inferior al superior
        for (let i = lower_limit; i < upper_limit; i ++) {
            console.log(data[i]);
        }

        res.statusCode = 200;
        result = data;

    }   else if (params.title && params.category) { // Si tiene query
        const query = `<${params.category}>: <${params.title}>`;
        var data = dataHandlerFile.findProduct(query);
        if (data) { // Si se encontró algo
            res.statusCode = 200;
            result = data;
        } else {
            res.statusCode = 404;
        result = {'message': 'Query para <category>: <title> no encontrado'};
        }
    } else if (params.category) {
        const query = `<${params.category}>:` 
        var data = dataHandlerFile.findProduct(query);
        if (data) { // Si se encontró algo
            res.statusCode = 200;
            result = data;
        } else {
            res.statusCode = 404;
        result = {'message': 'Query para <category>: no encontrado'};
        }
    } else if (params.title) {
        const query = `<${params.title}>` 
        var data = dataHandlerFile.findProduct(query);
        if (data) { // Si se encontró algo
            res.statusCode = 200;
            result = data;
        } else {
            res.statusCode = 404;
            result = {'message': 'Query para <title> no encontrado'};
        }
    }

    res.send(result);

});

// products/id
router.get('/:id', (req, res) => {
    let result = {}; // JSON explicando razón del status 
    res.setHeader('Content-Type', 'application/json');

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

// products/cart POST
router.post('/cart', (req, res) => {
    body = req.body; // Primero extraer body

    let result = {'message': 'Todo bien'}; // Variable para enviar desde el servidor
    res.setHeader('Content-Type', 'application/json');

    // Comprobar si es arreglo
    if (Array.isArray(body) == false) {
        res.statusCode = 400;
        result = {'message': 'No es un arreglo!'};
    } else { // Si es un arreglo, entonces ejecutar lo siguiente 

        // Comprobar que el uuid existe
        // 1. Del arreglo de Objetos, extraer y almacenar los uuids
        const uuids = body.map(obj => obj.uuid);

        // 2. Buscar si alguno de los uuids no existe. Si se cumple, regresar 404
        carrito = new ShoppingCart();
        const areUuidsValid = carrito.validateUuids(uuids);

        if (areUuidsValid === true) { // Aquí areUUidsValid es == true
            res.statusCode = 200;
            uuids.forEach((uuid) => {
                carrito.addItem(uuid); // Añadir al carrito los elementos
            });
            result = {'message': 'Todos los productos se cargaron al carrito de compras'};
        } else { // Si no es inválido (aquí are UuidsValid tiene el uuid inválido)
            res.statusCode = 404;
            result = {'message': `Producto con uuid ${areUuidsValid} no existe!`};
        }
    }

    // Hasta este punto todo bien, por lo tanto regresar el arreglo
    res.send(result);

});

module.exports = router;
