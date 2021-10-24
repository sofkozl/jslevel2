Vue.component('products', {
   data(){
       return {
           catalogUrl: '/catalogData.json',
           filtered: [],
           products: [],
       }
   },
    mounted(){
        this.$parent.getJson(`/api/products`)
            .then(data => {
                for (let item of data){
                    item.imgPath = `photo/${item.id_product}.jpg`;
                    this.$data.products.push(item);
                    this.$data.filtered.push(item);
                }
            });
    },
    methods: {
        filter(userSearch){
            let regexp = new RegExp(userSearch, 'i');
            this.filtered = this.products.filter(el => regexp.test(el.product_name));
        }
    },
   template: `<div class="item__card__box">
                <product v-for="item of filtered" 
                :key="item.id_product" 
                :img = "item.imgPath"
                :product="item"></product>
               </div>`
});
Vue.component('product', {
    props: ['product', 'img'],
    template: `
                <div class="item__card">
                    <a href="product.html" class="item__card__link">
                        <img class="item__card__photo" :src="img" alt="photo 1">
                        <div class="item__card__block">
                            <h4 class="item__card__subheading">{{product.product_name}}</h4>
                            <p class="item__card__text">Known for her sculptural takes on traditional tailoring, Australian arbiter of cool Kym Ellery teams up with Moda Operandi.</p>
                            <p class="item__card__price pink__elements">$ {{product.price}}</p>
                        </div>
                    </a>
                    <button class="add add__cart__text" @click="$root.$refs.cart.addProduct(product)"><img class="cart-logo" src="photo/cart-logo.svg" alt="cart">Add to cart</button>
                </div>
            `
})
