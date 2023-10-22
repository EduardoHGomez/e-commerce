const express = require('express');
const fs = require('node:fs');
const path = require('path');
const cors = require('cors');

const app = express()
const port = 3000;
app.use(express.json());

// --------- Router importado -------------
const router = require('./app/controllers/router.js'); 

// ---------- CORS ----------------------------------
app.use(cors({
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}));

// ---------- Variable global products --------------
function readProductsJSON() {
    fs.readFile('./products.json', 'utf-8', function(error, data){
        if(error) {
            console.log(error);
        } else {
            products = JSON.parse(data);
            console.log(products);
        }
    });
}

// --------------- RUTAS -------------------
app.use('/', router);

// Después de encender el servidor
app.listen(port, () => {
    console.log("Server running on port: " + port);
});