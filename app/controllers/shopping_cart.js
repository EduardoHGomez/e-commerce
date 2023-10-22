const dataHandlerFile = require('../controllers/data_handler.js');

class ShoppingCart {

    // AQUÍ AÑADIR EL CONSTRUCTOR
    constructor() {
        this.proxies = [];
        this.products = dataHandlerFile.loadData();
    }

    addItem(productUuid, amount) {
        // Obtener el índice del producto si existe
        var productExists = this.proxies.findIndex((product) => product.uuid === productUuid); 

        // Si no exise el producto, añadirlo al arreglo
        if (productExists === -1){
            // Crear el producto
            var productProxy = new ProductProxy(productUuid, amount);
            this.proxies.push(productProxy);
        } else {
            // Si existe el producto, actualizarlo con el valor actual más la del producto que se hizo
            this.proxies[productExists].amount += amount;
        }

    } 

    updateItem(productUuid, newAmount) {
        // Revisar si newAmount es negativo
        if (newAmount < 0){
            throw new ShoppingCartException("No puedes actualizar items con números negativos!");
        } else if (newAmount == 0) {
            // Obtener el index de productUuid y eliminarlo
            var indexProduct = this.proxies.findIndex((product) => product.uuid === productUuid); 
            this.proxies.splice(indexProduct, 1);
        } else {
            // Actualizar la cantidad del product Uuid
            var indexProduct = this.proxies.findIndex((product) => product.uuid === productUuid); 
            this.proxies[indexProduct].amount = newAmount;

        }
    }

    removeItem(productUuid) {
        const indexProduct = this.proxies.findIndex((product) => product.uuid === productUuid); 
        if (indexProduct === -1){
            throw new ShoppingCartException("Elemento no encontrado!");
        } else {
            this.proxies.splice(indexProduct, 1);
        }

    }

    calculateTotal() {
        var total = 0;

        this.proxies.forEach((productProxy) => {
            // Sumar la cantidad por el precio por unidad de ese producto
            var productProxyGlobal = getProductsById(productProxy.uuid); // Obtener 
            total += productProxy.amount * productProxyGlobal.pricePerUnit;
        });

        return total;
    }

    validateUuids(uuids) {
        // Mapear los strings de los productso
        const productsUuid = this.products.map((obj) => obj.uuid);
        let atLeastOneInvalid = false; // Variable para ver si algún id es inválido
        let invalidUuid;

        uuids.forEach((uuid) => {
            const found = productsUuid.indexOf(uuid);
            if (found === -1) {
                atLeastOneInvalid = true;
                invalidUuid = uuid;
            }
        });

        // Si hay un uuid inválido, regresar cuál es 
        if (atLeastOneInvalid) {
            return invalidUuid;
        }
       
        // Si todos los uuids son válidos, entonces regresar true
        return true;
    }

}

class ProductProxy {
    constructor(uuid, amount) {
        this.uuid = uuid;
        this.amount = amount;
    }
}


class ShoppingCartException {
    constructor(errorMessage) {
            this.errorMessage = errorMessage;
        }
}

module.exports = ShoppingCart;