const fs = require('node:fs');
const path = require('path');
const Product = require(path.resolve(__dirname + '/../controllers/product.js'));

let productsForSale = [];

async function getProducts() {
    data = fs.readFileSync(path.resolve(__dirname + '/../data/products.json'), 'utf-8');
    data = JSON.parse(data);
    productsForSale = data; // El arreglo pasa a ser los datos que obtuvimos
    return data;
}

async function getProductsById(uuid) {
    // Cargar los datos al arreglo
    loadData();

    // Buscar en el arreglo el producto con base en el uuid
    const found = productsForSale.find((product) => product.uuid === uuid);
    if (!found) {
        // Regresar un error de producto no encontrado
        return {'message': 'Producto no encontrado'}
    } else {
        return found; // Si encuentra, found ya es el json que regresa
    }

}

function createProduct(product) {
    // Revisar si ya existe
    // const productExists = productsForSale.findIndex((product) => product === product); 

    // // Si no existe, entonces añadirlo
    // if (productExists === -1){
    //     product = Product.createFromObject(product);
    //     productsForSale.push(product);
    // } else {
    //     throw new Error("No puedes añadir un producto igual");
    // }
    product = Product.createFromObject(product);

    previousData = fs.readFileSync(path.resolve(__dirname + '/../data/products.json'), 'utf-8');
    previousData = JSON.parse(previousData);
    previousData.push(product);
    console.log(previousData);
    
    // Cargar al json de la base de datos

}

function updateProduct(uuid, updatedProduct) {
    // Primero encontrar el índice
    const productIndex = productsForSale.findIndex((product) => product.uuid === uuid); 

    // Si no existe, entonces añadirlo
    if (productIndex === -1){
        throw new Error("Producto no encontrado, no se puede actualizar");
    } else {
        productsForSale[productIndex].title = updatedProduct.title;
        productsForSale[productIndex].description = updatedProduct.description;
        productsForSale[productIndex].imageUrl = updatedProduct.imageUrl;
        productsForSale[productIndex].unit = updatedProduct.unit;
        productsForSale[productIndex].stock = updatedProduct.stock;
        productsForSale[productIndex].pricePerUnit = updatedProduct.pricePerUnit;
        productsForSale[productIndex].category = updatedProduct.category;
    }
}

function deleteProduct(uuid) {
    // Primero encontrar el índice
    const productIndex = productsForSale.findIndex((product) => product.uuid === uuid); 

    // Si no existe, entonces mostrar error
    if (productIndex === -1){
        throw new Error("No se puede eliminar un producto que no existe");
    } else {
        productsForSale.splice(productIndex, 1);
    }
}

// Opcional
function findProduct(query){
    // Primero establecer los Regex para cada tipo

    const regexCategoryTitle = /<([^>]+)>: <([^>]+)>/; // Regex para "<category>:<Title>"
    const regexCategory = /<([^>]+)>:/; // Regex para "<category>:"
    const regexTitle = /<([^>]+)>/; // Regex para "<title>"

    const matchCategoryTitle = query.match(regexCategoryTitle);
    const matchCategory = query.match(regexCategory);
    const matchTitle = query.match(regexTitle);

    // console.log("Matches:", matchCategoryTitle, matchCategory, matchTitle);
    var resultProducts = [];

    if(matchCategoryTitle){ // Formato <category>: <Tile>   Importante: Lleva espacio
        const category = matchCategoryTitle[1];
        const title = matchCategoryTitle[2];
        productsForSale.forEach((product) => {
            if (product.category === category && product.title === title){
                resultProducts.push(product);
            }
        });
        if (resultProducts.length === 0) {
            return "Productos para <category>: <Title> No encontrados"
        }
    } else if (matchCategory) { // Formato <category>:
        const category = matchCategory[1];
        productsForSale.forEach((product) => {
            if (product.category === category){
                resultProducts.push(product);
            }
        });
        if (resultProducts.length === 0) {
            return "Productos para <category>: no encontrados";
        }
    } else if(matchTitle) { // Formato <Tile>
        const title = matchTitle[1];
        productsForSale.forEach((product) => {
            if (product.title === title){
                resultProducts.push(product);
            }
        });
        if (resultProducts.length === 0) {
            return "Productos para <title> no encontrados";
        }
    } else {
        return "Ningún filtro encontrado!";
    }

    return resultProducts;

}

function loadData() {
    data = fs.readFileSync(path.resolve(__dirname + '/../data/products.json'), 'utf-8');
    data = JSON.parse(data);
    productsForSale = data;
    return data;
}



exports.getProducts = getProducts;
exports.getProductsById = getProductsById;
exports.createProduct = createProduct;
exports.loadData= loadData;