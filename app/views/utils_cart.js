// ------- CART FUNCTIONS --------------------

// Función que crea el arreglo 
function createCart() {
    sessionStorage.setItem('products', '');
}

function storeToCart(uuid, amount) {
    // let currentProducts = JSON.parse(sessionStorage.getItem('products'));

    // Get the item
    var current_amount = sessionStorage.getItem(uuid);
    if (current_amount === null) {
        sessionStorage.setItem(uuid, parseInt(amount));
    } else {
        // Update value
        current_amount = parseInt(current_amount);
        current_amount += parseInt(amount);
        sessionStorage.setItem(uuid, current_amount);
    }

    console.log(sessionStorage);
}

function deletFromCart(uuid) {
    sessionStorage.removeItem(uuid);
}

function getCart() {
    var products = {'products': []};

    for (var i = 0; i < sessionStorage.length; i++) {
        var uuid = sessionStorage.key(i);
        var amount = sessionStorage.getItem(uuid);

        var productObj = 
        {
            'uuid': uuid,
            'amount': amount
        };
        products.products.push(productObj);
    }

    return products;

}