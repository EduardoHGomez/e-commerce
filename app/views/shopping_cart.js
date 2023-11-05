const xhr = new XMLHttpRequest();

document.addEventListener('DOMContentLoaded', () => {
    console.log("HTML Shopping cart Loaded");

    loadCart();

});

// Cargar desde sessionStorage
function loadCart() {
    let container = document.querySelector('#productsContainer');
    
    // Obtener el arreglo de todos los JSON que están en el carrito
    getShoppingCart().then((products) => {

        // Del arreglo devuelto, crear el carrito
        products.forEach((product) => {
            let newProduct = document.createElement('div');
            newProduct.classList.add('media');
            newProduct.classList.add('border');
            newProduct.classList.add('p-3');

            newProduct.innerHTML = `
                <img class="me-5 mt-4 rounded" style="float: right; width: 100px;" src="${product.imageUrl}" alt="Title" >
                <div class="media-body">
                    <h4>${product.title} <a role="button" class="btn btn-sm btn-danger"><i class="fa-solid fa-trash"></i></a></h4>
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
            container.append(newProduct);
        });
    });

}

async function getShoppingCart() {
    let result = [];
    let productsCart = getCart().products;

    productsCart.forEach((product) => {
        getProductAPI(product.uuid).then((product) => result.push(product));
    });

    return result;
}

async function getProductAPI(uuid) {
    let data;

    xhr.open('GET', `/products/${uuid}`, false);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
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