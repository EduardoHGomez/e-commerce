const xhr = new XMLHttpRequest();

document.addEventListener('DOMContentLoaded', () => {
    console.log("HTML Shopping cart Loaded");

    loadCart();

});

// Cargar desde sessionStorage
function loadCart() {
    let container = document.querySelector('#productsContainer');

    let uuidsFromCart = getCart().products;

    // Realizar post
    getShoppingCart();


    // Del arreglo devuelto, crear el carrito

    uuidsFromCart.forEach((product) => {
        let newProduct = document.createElement('div');
        newProduct.classList.add('media');

        newProduct.innerHTML = `
            <img class="me-5 mt-4 rounded" style="float: right; width: 100px;"src="https://m.media-amazon.com/images/I/91dTLHSQdkL._UF894,1000_QL80_.jpg" alt="Title" >
            <div class="media-body">
                <h4>Producto A <a role="button" class="btn btn-sm btn-danger"><i class="fa-solid fa-trash"></i></a></h4>
                <div class="input-group mb-3 w-50">
                    <span class="input-group-text">Cantidad: </span>
                    <input value="2" type="number" class="form-control" name="" required>
                </div>
                <div class="input-group mb-3 w-50">
                    <span class="input-group-text">Precio: </span>
                    <input value="20.00" type="number" class="form-control" name="" required>
                    <span class="input-group-text">MXN</span>
                </div>
            </div>
        `;
    });
}

function getShoppingCart() {
    let result = [];
    let productsCart = getCart().products;

    productsCart.forEach((product) => {
        getProductAPI(product.uuid).then((product) => result.push(product));
    });
}

async function getProductAPI(uuid) {
    let data;

    xhr.open('GET', `/products/${uuid}`, false);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        console.log(xhr.responseText);
        if (xhr.status != 200) {
            alert(xhr.status + ': ' + xhr.statusText); 
        } else { 
            // Cargar datos con base en el JSON regresado
            if (xhr.status === 200) {
                data = xhr.responseText;
            }
        }
    };
    xhr.send();

    return JSON.parse(data);
}


// ctrl + `