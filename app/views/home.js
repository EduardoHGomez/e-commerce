const xhr = new XMLHttpRequest();

document.addEventListener('DOMContentLoaded', () => {
    console.log("HTML Loaded");
    // Crear un arreglo para los productos
    // createCart();

    // Cargar los productos de la base de datos
    loadProducts();
    
    // Asignar variables
    let productAmountModal = document.getElementById('productAmountModal');
    productAmountModal.addEventListener('show.bs.modal', (event) => {
        // Button = Elemento relacionado (card)
        var button = event.relatedTarget;

        var productName = button.dataset.productname; // Usar lowercase para dataset!

        // Actualizar los datos del modal del producto
        productAmountModal.dataset.uuid = button.dataset.uuid;

        var currentTitle = productAmountModal.querySelector('#productAmountModalHeader'); // Cómo utilizar getElemntById o class?
        currentTitle.innerHTML=`Cantidad a agregar para <span class="modalAlbumName">${productName}</span>:`;
    });

    // Añadir al carrito
    let saveProductButton = document.querySelector('#saveProductButtonModal');
    saveProductButton.addEventListener('click', () => {
        // Get uuid and amount
        var uuid = productAmountModal.dataset.uuid;
        var amount = document.querySelector('#modalInput').value;
        storeToCart(uuid, amount);

        // Change value of modal to 1 (default)
        document.querySelector('#modalInput').value = '1';
    });
});

// ------- CART FUNCTIONS --------------------

// Función que crea el arreglo 
function createCart() {
    sessionStorage.setItem('products', '');
}

function storeToCart(uuid, amount) {
    console.log(uuid, amount);
    // let currentProducts = JSON.parse(sessionStorage.getItem('products'));

    // Get the item
    var current_amount = sessionStorage.getItem(uuid);
    if (current_amount === null) {
        console.log("Here1");
        sessionStorage.setItem(uuid, parseInt(amount));
    } else {
        // Update value
        console.log("Here2");
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

// Al hacer click en el carrito, cargar los productos al carrito de compras
function loadToServer() {
    // Fetch call
    var data = getCart();

    xhr.open('POST', '/products/cart');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data.products));
    xhr.onload = function() {
        if (xhr.status != 200) {
            alert(xhr.status + ': ' + xhr.statusText); 
        } else { 
            // Cargar datos con base en el JSON regresado
            console.log(xhr.response);
            console.log(xhr.status);

            if (xhr.status === 200) {
                console.log("Hi");
                window.location.href = 'http://localhost:3000/shopping_cart';
            }
        }
    };
}


// -------------- DOM FUNCTIONS -------------------

// Esta función regresa todos los productos en la base de datos
function loadProducts() {
    // Functión: Cargar al DOM el json que se obtenga
    xhr.open('GET', '/products');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send();
    xhr.onload = function() {
        if (xhr.status != 200) {
            alert(xhr.status + ': ' + xhr.statusText); 
        } else { 
            // Cargar datos con base en el JSON regresado
            var data = xhr.response;
            productListToHTML(data);
        }
    };
}

function productListToHTML(data) {
    // data = Arreglo de los productos 
    var container = document.getElementById('productsContainer');
    data = JSON.parse(data);    

    data.forEach((product) => {
        var newCard = document.createElement('div'); 
        newCard.classList.add('col-lg-3');
        newCard.classList.add('col-md-4');
        newCard.classList.add('col-sm-6');
        
        newCard.innerHTML = `
                <div class="card">
                    <img class="card-img-top" src="${product.imageUrl}" alt="Title">
                    <div class="card-body">
                        <h4 class="card-title">${product.title}</h4>
                        <p class="card-text">${product.description}</p>
                        <button 
                        type="button" data-uuid=${product.uuid}
                        data-bs-toggle="modal" data-bs-target="#productAmountModal" data-productname="${product.title}"
                        class="btn btn-secondary add-cart style="background-color: #3e84c1;">Agregar al carrito
                        </button>
                    </div>
                </div>
        `;
        
        container.append(newCard);

    });


}