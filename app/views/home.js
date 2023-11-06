const xhr = new XMLHttpRequest();

document.addEventListener('DOMContentLoaded', () => {
    console.log("HTML Loaded");
    // Crear un arreglo para los productos
    // createCart();

    // Cargar los productos de la base de datos
    paginatorInitialize();
    
    // ------------ MODAL ------------------
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


// --------------- SHOPPING CART ------------------
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



// ---------------- PAGINATOR -------------
function loadPaginationElements(current_page) {
    // Functión: Cargar al DOM el json que se obtenga
    xhr.open('GET', `/products?page=${current_page}`);
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

function paginatorHandler(numberPressed) {
    numberPressed = parseInt(numberPressed);
    
    // Primero, eliminar los items de productsContainer actuales
    let container = document.getElementById('productsContainer');
    container.innerHTML = "";

    // ------- Toggle active function ----------------
    // Actualizar paginator active
    let paginator = document.getElementById('paginatorContainer')
    let pressed_page = document.getElementById(`li-page-${numberPressed}`);
    let previous = paginator.dataset.previous;

    // Retirar el estado de active al valor previo y establecerlo al nuevo
    let previous_page = document.getElementById(`li-page-${previous}`);

    previous_page.classList.remove('active');
    pressed_page.classList.add('active');

    // Actualizar el valor previo
    paginator.dataset.previous = numberPressed;

    // Cargar los elementos en ese rango
    loadPaginationElements(numberPressed);

}

// Esta función regresa todos los productos en la base de datos e inicializa paginator
function paginatorInitialize() {
    // Functión: Cargar al DOM el json que se obtenga
    xhr.open('GET', `/products`);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send();
    xhr.onload = function() {
        if (xhr.status != 200) {
            alert(xhr.status + ': ' + xhr.statusText); 
        } else { 
            // Cargar datos con base en el JSON regresado
            var data = xhr.response;
            let length = JSON.parse(data).length;

            // --------- Paginator elements -------------
            let paginatorContainer = document.getElementById('paginatorContainer');

            // Inicializar el bracket derecho
            let paginatorRightBracket = document.createElement('li');
            
            // Primer edge case: solo existen cuatro elementos
            if (length <= 4) {  // Deshabilitar el bracket derecho
                let newPage = document.createElement('li');
                newPage.setAttribute('id', `li-page-1`)
                newPage.innerHTML = `
                    <a id="product-1" class="page-link" href="#">1</a>
                `;
                paginatorContainer.append(newPage);
                paginatorRightBracket.classList.add('page-item', 'disabled');
                paginatorRightBracket.innerHTML = `
                    <a class="page-link" href="#" aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                    </a>`;
            }
            // Caso normal ()
            else { 
                paginatorRightBracket.classList.add('page-item');
                paginatorRightBracket.innerHTML = `
                    <a class="page-link" href="#" aria-label="Next active">
                        <span aria-hidden="true">&raquo;</span>
                    </a>`;
                
                // Añadir con base en la cantidad de elementos
                for(let i = 0; i < length; i += 4) {
                    let newPage = document.createElement('li');
                    newPage.setAttribute('id', `li-page-${(i/4) + 1}`)
                    if (i == 0) { 
                        newPage.classList.add('page-item', 'active');
                    } else {
                        newPage.classList.add('page-item');
                    }
                    newPage.innerHTML = `
                        <a id="page-${(i/4) + 1}"class="page-link" href="javascript: paginatorHandler(${(i/4) + 1})">${i/4 + 1}</a>
                    `;
                    paginatorContainer.append(newPage);
                }
            }

            // Insertar el bracket derecho
            paginatorContainer.append(paginatorRightBracket);
            
            // ------------ IMPORTANTE: Cargar ahora los productos para el primer rango (0) ----------
            loadPaginationElements(0);
        }
    };
}

