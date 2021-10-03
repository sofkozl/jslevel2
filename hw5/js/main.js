const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

const app = new Vue({
    el: '#app',
    data: {
        userSearch: '',
        showCart: false,
        catalogUrl: '/catalogData.json',
        cartProducts: [],
        filteredProducts: [],
        products: [],
        imgCatalog: 'https://via.placeholder.com/200x150',
        imgCart: 'https://via.placeholder.com/50x100'
    },
    methods: {
        getJson(url){
            return fetch(url) // фетч - коннект к ресурсу (юрл), получаем промис, у которого 2 обработчика - зен и кетч
                .then(result => result.json()) // считываем файл, возвращаем снова промис
                .catch(error => {
                    console.log(error);
                })
        },
        addProduct(item){ // на вход - товар каталога, отличается от товара корзины кол-вом
            this.getJson(`${API}/addToBasket.json`)
                .then(data => {
                    if(data.result === 1) {
                        let find = this.cartProducts.find(el => el.id_product === item.id_product); // метод (массива) файнд вернет первый найденный элемент, берем каждый товар корзины берем айди товара и сверяем с товаром, который хотим добавить
                        if(find) { // если такой товар есть, то увеличиваем кол-во на 1
                            find.quantity++;
                        } else { // если нет, то
                            const prod = Object.assign({quantity: 1}, item); // сливаем два объекта в один
                            this.cartProducts.push(prod);
                        }
                    }
                })
        },
        filter(){
            let regexp = new RegExp(this.userSearch, 'i'); // строим объект без учета регистра
            this.filteredProducts = this.products.filter(el => regexp.test(el.product_name)); // обходим все товары методом (массива) фильтр применимо к каждому товару, создаем правило: берем у каждого товара название и тестируем на соотв. нашему правилу, получаем тру или фолс
        },
        remove(item) {
            this.getJson(`${API}/addToBasket.json`) // получаем исходник
                .then(data => {
                    if (data.result === 1) { // если кол-во 1, то удаление возможно
                        if (item.quantity>1) {
                            item.quantity--;
                        } else {
                            this.cartProducts.splice(this.cartProducts.indexOf(item), 1); // стереть с помощью метода массива сплайс
                        }
                    }
                })
        }
    },
    mounted(){ // 1. первое, что запускается
        this.getJson(`${API + this.cartUrl}`)
        .then(data => { // снова метод зен
            for(let el of data.contents){ // Обходим массив жсон
                this.cartProducts.push(el); // заполняем массив
            }
        }); 
       this.getJson(`${API + this.catalogUrl}`) // 2. снова вызываем метод гетжсон и парсим каталог товаров
           .then(data => {
               for(let el of data){ // сразу заполняем два массива
                   this.products.push(el);
                   this.filteredProducts.push(el);
               }
           });
        this.getJson(`getProducts.json`) // 3. и опять
            .then(data => {
                for(let el of data){
                    this.products.push(el);
                    this.filteredProducts.push(el);
                }
            })
    }
})

// class List {
//     constructor(url, container, list = list2){
//         this.container = container;
//         this.list = list;
//         this.url = url;
//         this.goods = [];
//         this.allProducts = [];
//         this.filtered = [];
//         this._init();
//     }
//     getJson(url){
//         return fetch(url ? url : `${API + this.url}`)
//             .then(result => result.json())
//             .catch(error => {
//                 console.log(error);
//             })
//     }
//     handleData(data){
//         this.goods = [...data];
//         this.render();
//     }
//     calcSum(){
//         return this.allProducts.reduce((accum, item) => accum += item.price, 0);
//     }
//     render(){
//         const block = document.querySelector(this.container);
//         for (let product of this.goods){
//             const productObj = new this.list[this.constructor.name](product);
//             console.log(productObj);
//             this.allProducts.push(productObj);
//             block.insertAdjacentHTML('beforeend', productObj.render());
//         }
//     }
//     filter(value){
//         const regexp = new RegExp(value, 'i');
//         this.filtered = this.allProducts.filter(product => regexp.test(product.product_name));
//         this.allProducts.forEach(el => {
//             const block = document.querySelector(`.product-item[data-id="${el.id_product}"]`);
//             if(!this.filtered.includes(el)){
//                 block.classList.add('invisible');
//             } else {
//                 block.classList.remove('invisible');
//             }
//         })
//     }
//     _init(){
//         return false
//     }
// }
//
// class Item{
//     constructor(el, img = 'https://placehold.it/200x150'){
//         this.product_name = el.product_name;
//         this.price = el.price;
//         this.id_product = el.id_product;
//         this.img = img;
//     }
//     render(){
//         return `<div class="product-item" data-id="${this.id_product}">
//                 <img src="${this.img}" alt="Some img">
//                 <div class="desc">
//                     <h3>${this.product_name}</h3>
//                     <p>${this.price} $</p>
//                     <button class="buy-btn"
//                     data-id="${this.id_product}"
//                     data-name="${this.product_name}"
//                     data-price="${this.price}">Купить</button>
//                 </div>
//             </div>`
//     }
// }
//
// class ProductsList extends List{
//     constructor(cart, container = '.products', url = "/catalogData.json"){
//         super(url, container);
//         this.cart = cart;
//         this.getJson()
//             .then(data => this.handleData(data));
//     }
//     _init(){
//         document.querySelector(this.container).addEventListener('click', e => {
//             if(e.target.classList.contains('buy-btn')){
//                 this.cart.addProduct(e.target);
//             }
//         });
//         document.querySelector('.search-form').addEventListener('submit', e => {
//             e.preventDefault();
//             this.filter(document.querySelector('.search-field').value)
//         })
//     }
// }
//
//
// class ProductItem extends Item{}
//
// class Cart extends List{
//     constructor(container = ".cart-block", url = "/getBasket.json"){
//         super(url, container);
//         this.getJson()
//             .then(data => {
//                 this.handleData(data.contents);
//             });
//     }
//     addProduct(element){
//         this.getJson(`${API}/addToBasket.json`)
//             .then(data => {
//                 if(data.result === 1){
//                     let productId = +element.dataset['id'];
//                     let find = this.allProducts.find(product => product.id_product === productId);
//                     if(find){
//                         find.quantity++;
//                         this._updateCart(find);
//                     } else {
//                         let product = {
//                             id_product: productId,
//                             price: +element.dataset['price'],
//                             product_name: element.dataset['name'],
//                             quantity: 1
//                         };
//                         this.goods = [product];
//                         this.render();
//                     }
//                 } else {
//                     alert('Error');
//                 }
//             })
//     }
//     removeProduct(element){
//         this.getJson(`${API}/deleteFromBasket.json`)
//             .then(data => {
//                 if(data.result === 1){
//                     let productId = +element.dataset['id'];
//                     let find = this.allProducts.find(product => product.id_product === productId);
//                     if(find.quantity > 1){
//                         find.quantity--;
//                         this._updateCart(find);
//                     } else {
//                         this.allProducts.splice(this.allProducts.indexOf(find), 1);
//                         document.querySelector(`.cart-item[data-id="${productId}"]`).remove();
//                     }
//                 } else {
//                     alert('Error');
//                 }
//             })
//     }
//     _updateCart(product){
//        let block = document.querySelector(`.cart-item[data-id="${product.id_product}"]`);
//        block.querySelector('.product-quantity').textContent = `Quantity: ${product.quantity}`;
//        block.querySelector('.product-price').textContent = `$${product.quantity*product.price}`;
//     }
//     _init(){
//         document.querySelector('.btn-cart').addEventListener('click', () => {
//             document.querySelector(this.container).classList.toggle('invisible');
//         });
//         document.querySelector(this.container).addEventListener('click', e => {
//            if(e.target.classList.contains('del-btn')){
//                this.removeProduct(e.target);
//            }
//         })
//     }
//
// }
//
// class CartItem extends Item{
//     constructor(el, img = 'https://placehold.it/50x100'){
//         super(el, img);
//         this.quantity = el.quantity;
//     }
//     render(){
//     return `<div class="cart-item" data-id="${this.id_product}">
//             <div class="product-bio">
//             <img src="${this.img}" alt="Some image">
//             <div class="product-desc">
//             <p class="product-title">${this.product_name}</p>
//             <p class="product-quantity">Quantity: ${this.quantity}</p>
//         <p class="product-single-price">$${this.price} each</p>
//         </div>
//         </div>
//         <div class="right-block">
//             <p class="product-price">$${this.quantity*this.price}</p>
//             <button class="del-btn" data-id="${this.id_product}">&times;</button>
//         </div>
//         </div>`
//     }
// }
// const list2 = {
//     ProductsList: ProductItem,
//     Cart: CartItem
// };
//
// let cart = new Cart();
// let products = new ProductsList(cart);
// products.getJson(`getProducts.json`).then(data => products.handleData(data));

