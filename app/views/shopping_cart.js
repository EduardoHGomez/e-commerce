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
        let totalContainer = document.querySelector('#totalContainer');

        // Del arreglo devuelto, crear el carrito
        products.forEach((product) => {
            let newTotal = document.createElement('p');
            newTotal.setAttribute('id', `totalProduct-${product.uuid}`);
            newTotal.classList.add('totalInstance');

            newTotal.innerHTML = `<b>${product.title} </b><span class="total-amount">${product.amount}</span> x $
            <span class="total-price">${product.pricePerUnit}</span>`;
            totalContainer.append(newTotal);

            let newProduct = document.createElement('div');
            newProduct.classList.add('media');
            newProduct.classList.add('border');
            newProduct.classList.add('p-3');
            newProduct.setAttribute('id', `product-${product.uuid}`);

            newProduct.innerHTML = `
                <img class="me-5 mt-4 rounded" style="float: right; width: 100px;" src="${product.imageUrl}" alt="Title" >
                <div class="media-body">
                    <h4>${product.title} <a role="button" class="btn btn-sm btn-danger"
                    onclick="deleteFromCart('${product.uuid}')" ><i class="fa-solid fa-trash"></i></a></h4>
                    <div class="input-group mb-3 w-50">
                        <span class="input-group-text">Cantidad: </span>
                        <input value="${product.amount}" type="number" class="form-control" name="" disabled min=0>
                        <div class="change-amount-div"> 
                            <span class="change-amount-pencil" type="button" data-uuid="${product.uuid}"
                            onclick="edit('${product.uuid}')">
                            <i class="fa-solid fa-pen" style="color: #ffffff"></i></span>
                            <span class="change-amount-confirm fa-md" type="button" data-uuid="${product.uuid}"
                            onclick="hideButtonsConfirm('${product.uuid}')">
                            <i class="fa-solid fa-check" style="color: #ffffff;"></i></span>
                            <span class="change-amount-cancel" type="button" data-uuid="${product.uuid}"
                            onclick="hideButtonsCancel('${product.uuid}')">
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
        updateTotal();
    });

}

// Esta función regresa en un arreglo de la forma [JSON1, JSON2]
// Donde cada JSON es un producto
async function getShoppingCart() {
    let result = [];
    // Cada elemento de productsCart es {'uuid': uuid, 'amount': n}
    let productsCart = getCart().products;

    // Por cada elemento del arreglo del carrito, obtener su información usando la ruta API
    productsCart.forEach((product) => {
        // Obtener del servidor el JSON dado un uuid
        getProductAPI(product.uuid).then((productAPI) =>  {
            productAPI.amount = product.amount;
            result.push(productAPI)
        });
    });

    return result;
}

// Llamada a http:// GET /products/:id (200) 
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

// ctrl + ` para comentar :o

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

function hideButtonsConfirm(uuid) {
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

    // Actualizar en sessionStorage
    let current_amount = input.value;
    updateCart(uuid, current_amount);

    // Actualizar el total
    let newTotal = document.querySelector(`#totalProduct-${uuid}`);
    let newTotalAmount = newTotal.querySelector('.total-amount');
    newTotalAmount.innerHTML = `${current_amount}`;

    updateTotal();
}

function updateTotal() {
    let allTotals = document.querySelectorAll('.totalInstance');
    let total = 0;
    allTotals.forEach((product) => {
        var amount = parseInt(product.querySelector('.total-amount').innerHTML);
        var price = parseFloat(product.querySelector('.total-price').innerHTML);
        let number = amount * price;
        total += number;
    });

    let totalCantidad = document.querySelector('#totalCantidad');
    total = total.toFixed(2);
    totalCantidad.innerHTML = total;
    console.log(total);
}

function hideButtonsCancel(uuid) {
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

    input.value = sessionStorage.getItem(uuid);
}

function deleteItem(uuid) {
    let container = document.querySelector('#productsContainer');
    let product = container.querySelector(`#product-${uuid}`);

    let newTotal = document.querySelector(`#totalProduct-${uuid}`);
    newTotal.remove();

    product.remove(product);
    sessionStorage.removeItem(uuid);
    console.log(sessionStorage);
    updateTotal();
}

function fetchItem(uuid) {
    fetch('http://localhost:3000/products').
    then(response => response.json()).
    then(products => {
        products.forEach((product) => {
            console.log(product);
        });
    });

}