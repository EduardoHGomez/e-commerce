// --------------- DEFINICIONES ----------------------
const express = require('express');
const path = require('path');

const productRouter = require(path.resolve(__dirname + "../../routes/product.js"));
const adminProductRouter = require(path.resolve(__dirname + "../../routes/admin_products.js"));
const page = require(path.resolve(__dirname + "../../routes/admin_products.js"));

const router = express.Router();

function validateAdmin(req, res, next) {
    // 1. Comprobar que tenga el header x-auth
    const flag = req.headers['x-auth'];
    let result;
    res.setHeader('Content-Type', 'application/json');

    if (flag === undefined){
        res.statusCode = 403;
        result = {'message': 'Acceso no autorizado, no se cuenta con privilegios de administrador (x-auth no proporcionado)'};
        res.send(result);
    } else if (flag != 'admin') {
        res.statusCode = 400;
        result = {'message': 'Acceso no autorizado, no se cuenta con privilegios de administrador (x-auth incorrecto)'};
        res.send(result);
    } else if (flag === 'admin') {
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

// About us route
router.get("/about_us", (req, res) => {
    res.sendFile(path.resolve(__dirname + "/../views/about_us.html"));
});

// Category A
router.get("/categoryA", (req, res) => {
    res.sendFile(path.resolve(__dirname + "/../views/categoryA.html"));
});

// Category B
router.get("/categoryB", (req, res) => {
    res.sendFile(path.resolve(__dirname + "/../views/categoryB.html"));
});


// Products
router.use("/products", productRouter);

// Admin
router.use("/admin", validateAdmin, adminProductRouter);

module.exports = router;