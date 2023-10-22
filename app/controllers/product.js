const utilsFile = require('../controllers/utils.js');

class Product {
    uuid = utilsFile.generateUUID();
    title;
    description;
    imageUrl;
    unit;
    stock;
    pricePerUnit;
    category;

    constructor(title, description, imageUrl, unit, stock, pricePerUnit, category){
        this.title = title;
        this.description = description;
        this.imageUrl = imageUrl;
        this.unit = unit;
        this.stock = stock;
        this.pricePerUnit = pricePerUnit;
        this.category = category;
    }

    // ------------ Setters ---------------
    set uuid(uuid){ 
        throw new ProductException("Product uuids are auto-generated."); // El usuario no puede generarlos
    } 

    set title(title){
        if (title!= "") this.title= title; 
        else throw new ProductException("No empty strings allowed");
    }

    set description(description){
        if (description!= "") this.description= description; 
        else throw new ProductException("No empty strings allowed");
    }

    set imageUrl(imageUrl){ 
        if (imageUrl!= "") this.imageUrl = imageUrl; 
        else throw new ProductException("No empty strings allowed");
    }

    set unit(unit){ 
        if (unit!= "") this.unit = unit; 
        else throw new ProductException("No empty strings allowed");
    }

    set pricePerUnit(pricePerUnit){
        if (pricePerUnit >= 0) this.pricePerUnit = pricePerUnit; 
        else throw new ProductException("No negative numbers");
    }

    set category(category){
        if (category != "") this.category = category; 
        else throw new ProductException("No empty strings allowed");
    }

    // ------------- Getters ------------------
    get uuid() { return this.uuid};
    get title() { return this.title};
    get description() { return this.description};
    get imageUrl() { return this.imageUrl};
    get unit() { return this.unit};
    get stock() { return this.stock};
    get pricePerUnit() { return this.pricePerUnit};
    get category() { return this.category};


    // --------------------- Static methods ----------------
    static createFromJson(jsonValue) {
        var data = JSON.parse(jsonValue);

        title = data.title,
        description = data.description,
        imageUrl = data.imageUrl,
        unit = data.unit,
        pricePerUnit = data.pricePerUnit,
        category = data.category

        return new Product(uuid, title, description, imageUrl, unit, pricePerUnit, category);
    }

    static createFromObject(obj) {
        let new_object = this.cleanObject(obj); 

        let title = new_object.title;
        let description = new_object.description;
        let imageUrl = new_object.imageUrl;
        let unit = new_object.unit;
        let stock = new_object.stock;
        let pricePerUnit = new_object.pricePerUnit;
        let category = new_object.category;

        return new Product(title, description, imageUrl, unit, stock, pricePerUnit, category);
    }

    static cleanObject(obj) {

        let cleanObject = {
            title: obj.title,
            description:  obj.description,
            imageUrl: obj.imageUrl,
            unit: obj.unit,
            stock: obj.stock,
            pricePerUnit:  obj.pricePerUnit,
            category: obj.category
        }
        return cleanObject;
    }

    productListToHTML() {
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

}

class ProductException {
    constructor(errorMessage) {
        this.errorMessage = errorMessage;
    }
}

module.exports = Product;