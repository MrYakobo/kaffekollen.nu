<style>
    .coop {
        color: green
    }

    .willys {
        color: #d00
    }

    .price {
        font-size: 1.2em;
        font-family: 'Exo 2';
    }

    .promo{
        font-size: 1.1em;
        font-family: 'Exo 2';
        padding:5px !important
    }
    .strike{
        text-decoration: line-through
    }
</style>
<template>
    <div class="card columns is-multiline is-gapless">
        <div class="column is-12">
            <figure class="image">
                <img :src="image">
            </figure>
        </div>
        <p :class="[res.tablename, 'column']">{{res.tablename}}</p>
        <p class="column is-12">{{res.name}}</p>
        <div class="column">
            <template v-if="res.promo">
                <span class="price strike has-text-grey">{{res.price}}</span>
                <span class="price has-text-success">{{res.promo_price/res.promo_amount}}</span><span class="priceunit"> /st</span>
            </template>
            <template v-else>
                <span class="price">{{res.price}}</span><span class="priceunit"> /st</span>

            </template>
        </div>
        <span v-if="res.promo" class="column is-12 promo notification is-light">{{res.promo_label}}</span>
    </div>
</template>
<script>
    export default {
        props: ['res'],
        computed: {
            image() {
                if (this.res.img_preview == null) {
                    return this.res.img_full
                }
                return this.res.img_preview
            }
        }
    }
</script>