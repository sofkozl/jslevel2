// const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

Vue.component('cart', {
    data(){
      return {
          cartUrl: '/getBasket.json',
          cartItems: [],
          showCart: false
      }
    },
    mounted(){
        this.$parent.getJson(`/api/cart`)
            .then(data => {
                for (let item of data.contents){
                    item.imgPath = `photo/${item.id_product}.jpg`;
                    this.$data.cartItems.push(item);
                }
            });
    },
    methods: {
        addProduct(item) {
            let find = this.cartItems.find(el => el.id_product === item.id_product );
            if (find) {
                this.$parent.putJson(`/api/cart/${item.id_product}/${item.product_name}`, {quantity: 1} )
                    .then(data => {
                        if (data.result) {
                            find.quantity++;
                        }
                    } )
            } else {
                let prod = Object.assign( { quantity: 1 }, item );
                this.$parent.postJson(`api/cart/${item.id_product}/${item.product_name}`, prod)
                    .then( data => {
                        if (data.result) {
                            this.cartItems.push(prod);
                        }
                    } )
            }
        },
        remove(item){
            if (item.quantity > 1 ) {
                this.$parent.putJson( `/api/cart/${item.id_product}/${item.product_name }`, { quantity: -1 } )
                    .then( data => {
                        if ( data.result ) {
                            item.quantity--;
                        }
                    } )
            } else {
                this.$parent.delJson( `/api/cart/${item.id_product}/${ item.product_name }`, item )
                    .then( data => {
                        if (data.result) {
                            this.cartItems.splice( this.cartItems.indexOf(item), 1 );
                        } else {
                            console.log( 'error' );
                        }
                    } )
            }
        },
    },
    template: `<div>
    <button class="top__list cart-button" type="button" @click="showCart = !showCart"><img src="photo/cart-logo.svg" alt="cart"></button>
            <div class="cart-block" v-show="showCart">
                <cart-item v-for="item of cartItems" 
                :key="item.id_product" 
                :img="item.imgPath" 
                :cart-item="item" 
                @remove="remove">
                </cart-item>
            </div>
            </div>`
} );

Vue.component('cart-item', {
    props: ['img', 'cartItem'],
    template: `
    <div class="cart-item">
                        <img class="basket-photo-product" :src="img" alt="Some img">
                        <div class="basket-product-description">
                            <div class="basket-product-title">{{ cartItem.product_name }}</div>
                            <div class="basket-product-quantity">Quantity: {{ cartItem.quantity }}</div>
                            <div class="basket-product-price">$ {{ cartItem.price }} each</div>
                        </div>
                    <div class="right-block">
                        <div class="product-price">{{cartItem.quantity*cartItem.price}}</div>
                        <button class="del-btn" @click="$emit('remove', cartItem)">&times;</button>
                    </div>
                </div>
    `
})