// --------------- DEFINICIONES ----------------------
const express = require('express');
const path = require('path');

const productRouter = require(path.resolve(__dirname + "../../routes/product.js"));
const adminProductRouter = require(path.resolve(__dirname + "../../routes/admin_products.js"));

const router = express.Router();

function validateAdmin(req, res, next) {
    // 1. Comprobar que tenga el header x-auth
    const flag = req.headers['x-auth'];
    let result;

    if (flag === undefined){
        res.statusCode = 400;
        result = {'message': 'x-auth no incluido'};
        res.send(result);
    } else if (flag != 'password') {
        res.statusCode = 400;
        result = {'message': 'x-auth incorrecto'};
        res.send(result);
    } else if (flag === 'password') {
        // Avanzar a la siguiente ruta si todo bien
        next();
    }

}


// --------------- RUTAS -------------------------
// Root /
router.get("/", (req, res) => {
    //res.send("e-commerce práctica 3");
    res.sendFile(path.resolve(__dirname + "/../views/home.html"));
});

// Home
router.get("/home", (req, res) => {
    res.sendFile(path.resolve(__dirname + "/../views/home.html"));
});

// Shopping cart
router.get("/shopping_cart", (req, res) => {
    res.sendFile(path.resolve(__dirname + "/../views/shopping_cart.html"));
});

// Products
router.use("/products", productRouter);

// Admin
router.use("/admin", validateAdmin, adminProductRouter);

module.exports = router;