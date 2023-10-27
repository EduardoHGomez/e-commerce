document.addEventListener('DOMContentLoaded', () => {
    console.log("HTML Loaded");
});


function productListToHTML() {
    var container = document.getElementById('newProducts');
    var newCard = document.createElement('div'); 
    newCard.classList.add('col-lg-3');
    newCard.classList.add('col-md-4');
    newCard.classList.add('col-sm-6');
    
    newCard.innerHTML = `
            <div class="card">
                <img class="card-img-top" src="${this.imageUrl}" alt="Title">
                <div class="card-body">
                    <h4 class="card-title">${this.title}</h4>
                    <p class="card-text">${this.description}</p>
                </div>
            </div>
    `;
    
    container.append(newCard);
}