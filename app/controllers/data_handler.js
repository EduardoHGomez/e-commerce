const fs = require('node:fs');
const path = require('path');
const Product = require(path.resolve(__dirname + '/../controllers/product.js'));

let productsForSale = [];

function getProducts() {
    data = fs.readFileSync(path.resolve(__dirname + '/../data/products.json'), 'utf-8');
    data = JSON.parse(data);
    productsForSale = data; // El arreglo pasa a ser los datos que obtuvimos
    return data;
}

function getProductsById(uuid) {
    // Cargar los datos al arreglo
    loadData();

    // Buscar en el arreglo el producto con base en el uuid
    const found = productsForSale.find((product) => product.uuid === uuid);
    if (!found) {
        // Regresar un error de producto no encontrado
        return false;
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

    // One way to convert from Object to JSON
    const new_JSON = 
    {
        'uuid': product.uuid,
        'title': product.title,
        'description': product.description,
        'imageUrl': product.imageUrl,
        'unit': product.unit,
        'stock': product.stock,
        'pritcePerUnit': product.pricePerUnit,
        'category': product.category
    }
    // Añadir el JSON al arreglo de previousData
    previousData.push(new_JSON);
    previousData = JSON.stringify(previousData);
    
    // Cargar al json de la base de datos
    fs.writeFileSync(path.resolve(__dirname + '/../data/products.json'), previousData);

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

    // Write on the file
    const newJSON = JSON.stringify(productsForSale);
    fs.writeFileSync(path.resolve(__dirname + '/../data/products.json'), newJSON);

}

function deleteProduct(uuid) {
    // Primero encontrar el índice
    const productIndex = productsForSale.findIndex((product) => product.uuid === uuid); 
    const deletedProduct = productsForSale[productIndex].title;

    // Si no existe, entonces mostrar error
    if (productIndex === -1){
        throw new Error("No se puede eliminar un producto que no existe");
    } else {
        productsForSale.splice(productIndex, 1);
    }

    const newJSON = JSON.stringify(productsForSale);
    fs.writeFileSync(path.resolve(__dirname + '/../data/products.json'), newJSON);

    return deletedProduct;

}

// Opcional
function findProduct(query){
    loadData();
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
            // Deprecated return "Productos para <category>: <Title> No encontrados"
            return false;
        }
    } else if (matchCategory) { // Formato <category>:
        const category = matchCategory[1];
        productsForSale.forEach((product) => {
            if (product.category === category){
                resultProducts.push(product);
            }
        });
        if (resultProducts.length === 0) {
            // Deprecated return "Productos para <category>: no encontrados";
            return false;
        }
    } else if(matchTitle) { // Formato <Tile>
        const title = matchTitle[1];
        productsForSale.forEach((product) => {
            if (product.title === title){
                resultProducts.push(product);
            }
        });
        if (resultProducts.length === 0) {
            // Deprecated return "Productos para <title> no encontrados";
            return false;
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
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
exports.findProduct = findProduct;