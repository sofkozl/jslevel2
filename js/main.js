class ProductList{ // класс каталог товаров
    constructor(container='.products'){ // элемент, где мы указываем, где необходимо вывести товар
        this.container = container; // св-во контейнер
        this.goods = []; // св-во массив товаров (из чего состоит каталог)
        this._fetchProducts(); // метод, заполняющий массив goods объектами, запускаем его
        this.render(); // метод вывода товаров на страницу, запускаем его
    }

    _fetchProducts(){
        this.goods = [
            {id: 1, title: 'Notebook', price: 2000},
            {id: 2, title: 'Mouse', price: 20},
            {id: 3, title: 'Keyboard', price: 200},
            {id: 4, title: 'Gamepad', price: 50},
        ];
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
        alert(totalSum);
    }
}

class ProductItem{ // класс товара
    constructor(product,img='https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png'){ // (3) в конструктор получили товар, по умолч. задана одна картинка на всех
        this.title = product.title; // (4) наполняем объект класса товар свойствами (отправили объект из массива класса каталога)
        this.id = product.id;
        this.price = product.price;
        this.img = img;
    }
    render(){ // на этот метод ссылается п. 5
           return `<div class="product-item">
                <img class="product-photo" src="${this.img}">
                <h3>${this.title}</h3>
                <p>${this.price}</p>
                <button class="buy-btn">Купить</button>
            </div>`
    }
}

class Basket{

    addProduct(){}

    removeProduct(){}

    changeProduct(){}

    renderBasket(){}
}

class ProductsInBasket {

    renderProduct(){}

}

let list = new ProductList(); // старт формирования разметки каталога товаров, создаем объект класса каталога товаров

list.sumUp();

// const products = [
//     { id: 1, title: 'Notebook', price: 2000 },
//     { id: 2, title: 'Mouse', price: 20 },
//     { id: 3, title: 'Keyboard', price: 200 },
//     { id: 4, title: 'Gamepad', price: 50 },
// ];
// //Функция для формирования верстки каждого товара
// //Добавить в выводе изображение
// const renderProduct = (item) => {
//     return `<div class="product-item">
//                 <img class="product-photo" src="pictures/no_image_available.png" alt="no photo">
//                 <h3>${item.title}</h3>
//                 <p>${item.price}</p>
//                 <button class="buy-btn">Купить</button>
//             </div>`
// };
// const renderPage = list => {
//     const productsList = list.map(item => renderProduct(item)).join("");
//     console.log(productsList);
//     document.querySelector('.products').innerHTML = productsList;
// };

// renderPage(products);

// метод, определяющий сумму товара, метод фор ич
// 2 пустых класса для формирования корзины (корзина и товары корзины) с пустыми методами