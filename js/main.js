const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

class ProductList{ // класс каталог товаров
    constructor(container='.products'){ // элемент, где мы указываем, где необходимо вывести товар
        this.container = container; // св-во контейнер
        this.goods = []; //массив товаров из JSON документа
        this._getProducts() // метод, заполняющий массив goods объектами из документы json
            .then(data => { //data - объект js (в исходнике он уже в массиве)
                this.goods = data; // после json всегда идет then, вставляем массив
                this.render(); // метод вывода товаров на страницу, запускаем его
            });      
    }

    _getProducts(){
        return fetch(`${API}/catalogData.json`) // возвращаем вызов функцию fetch и указываем, к какому ресурсу делаем коннект
            .then(result => result.json()) // если все ок, то дальше считываем (парсим) исходник, исходник => применяем к нему метод json, получаем промис - объект js
            .catch(error => { // если не ок, выводится ошибка
                console.log(error);
            })
    }
    
    render(){ // метод, создающий блок
        const block = document.querySelector(this.container); // (1) получаем элемент из верстки по селектору с классом .products
        for(let product of this.goods){ // (2) в цикле обходим массив товаров
            const item = new ProductItem(product); // (3) и каждый объект массива мы передаем в конструктор класса товара
             block.insertAdjacentHTML("beforeend",item.render()); // (5) добавляем в блок разметку, далее возвращается в п. 2 и снова повторяем все шаги, пока весь массив из объектов не будет пройден
//           block.innerHTML += item.render();
        }
    }

    sumUp (){
        let totalSum = 0;
        for(let product of this.goods){
            totalSum += product.price;
        }
    }
}

class ProductItem{ // класс товара
    constructor(product,img='https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png'){ // (3) в конструктор получили товар, по умолч. задана одна картинка на всех
        this.title = product.product_name; // (4) наполняем объект класса товар свойствами (отправили объект из массива класса каталога)
        this.id = product.id_product;
        this.price = product.price;
        this.img = img;
    }
    render(){ // на этот метод ссылается п. 5
           return `<div class="product-item" data-id="${this.id}">
                <img class="product-photo" src="${this.img}">
                <h3>${this.title}</h3>
                <p>${this.price} $</p>
                <button class="buy-btn">Купить</button>
            </div>`
    }
}

class Basket{
    constructor(container='.basket-box'){
        this.container = container;
        this.goods = [];
        this._clickBasket();
        this._getBasket()
            .then(data => {
                this.goods = data.contents;
                this.renderBasket();
            });      
    }
    addProduct(){}

    removeProduct(){}

    changeProduct(){}

    _clickBasket(){
        const basket = document.querySelector('.btn-cart').addEventListener('click', () => {
            document.querySelector(this.container).classList.toggle('hide');
        })
    }

    _getBasket(){
        return fetch(`${API}/getBasket.json`)
            .then(result => result.json())
            .catch(error => {
                console.log(error);
            })
    }

    renderBasket(){ // вывести список товаров
        const block = document.querySelector(this.container);
        for(let product of this.goods){
            const item = new ProductsInBasket(product);
            block.insertAdjacentHTML("beforeend",item.renderProduct());
        }
    }
}

class ProductsInBasket {
    constructor(product,img='https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png'){ // (3) в конструктор получили товар, по умолч. задана одна картинка на всех
        this.title = product.product_name;
        this.id = product.id_product;
        this.price = product.price;
        this.img = img;
    }
    renderProduct(){ // вертска товара для корзины
        return `<div class="basket-row">
                    <img class="basket-photo-product" src="${this.img}">
                    <div class="basket-product-description">
                        <h3 class="basket-product-title">${this.title}</h3>
                        <p class="basket-product-price">${this.price} $</p>
                    </div>
                    <div>
                        <p class="basket-product-quantity">Кол-во: <span class="product-count" data-id="${this.id}">1</span> шт.</p>
                    </div>
                </div>`
    }
}

let list = new ProductList(); // старт формирования разметки каталога товаров, создаем объект класса каталога товаров

list.sumUp();

let basket = new Basket();
