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
                    <div class="input-group mb-3 w-50" id="product-${product.uuid}">
                        <span class="input-group-text">Cantidad: </span>
                        <input value="2" type="number" class="form-control" name="" disabled>
                        <div class="change-amount-div"> 
                            <span class="change-amount-pencil" type="button" data-uuid="${product.uuid}"
                            onclick="edit('${product.uuid}')">
                            <i class="fa-solid fa-pen" style="color: #ffffff"></i></span>
                            <span class="change-amount-confirm fa-md" type="button" data-uuid="${product.uuid}"
                            onclick="hideButtons('${product.uuid}')">
                            <i class="fa-solid fa-check" style="color: #ffffff;"></i></span>
                            <span class="change-amount-cancel" type="button" data-uuid="${product.uuid}"
                            onclick="hideButtons('${product.uuid}')">
                            <i class="fa-solid fa-xmark fa-md" style="color: #ffffff;"></i></span>
                        </div>
                    </div>
                    <div class="input-group mb-3 w-50">
                        <span class="input-group-text">Precio: </span>
                        <span class="input-group-text w-25" style="background-color: white">${product.pricePerUnit}</span>
                        <span class="input-group-text">MXN</span>
                    </div>
                </div>
            `;
            container.append(newProduct);
        });
    });

}

// MODIFY TO {product: {json}, amount: n}

async function getShoppingCart() {
    let result = [];
    let productsCart = getCart().products;

    // De sessionStorage
    productsCart.forEach((product) => {
        // Obtener del servidor el JSON dado un uuid
        getProductAPI(product.uuid).then((productAPI) =>  {
            productAPI.amount = product.amount;
            result.push(productAPI)
        });
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

function edit(uuid) {
    let input_div = document.querySelector(`#product-${uuid}`);
    let container = input_div.querySelector('.change-amount-div');
    let pencil = container.querySelector('.change-amount-pencil');
    let confirm = container.querySelector('.change-amount-confirm');
    let cancel = container.querySelector('.change-amount-cancel');
    let input = input_div.querySelector('input');

    // Ocultar lápiz y mostrar confirm y cancel
    pencil.style.display = 'none';
    confirm.style.display = 'flex';
    cancel.style.display = 'flex';
    input.disabled = false;
}

function hideButtons(uuid) {
    let input_div = document.querySelector(`#product-${uuid}`);
    let container = input_div.querySelector('.change-amount-div');
    let pencil = container.querySelector('.change-amount-pencil');
    let confirm = container.querySelector('.change-amount-confirm');
    let cancel = container.querySelector('.change-amount-cancel');
    let input = input_div.querySelector('input');

    // Ocultar botones de confirmar y cancelar. Mostrar lápiz
    pencil.style.display = 'flex';
    confirm.style.display = 'none';
    cancel.style.display = 'none';
    input.disabled = true;
}