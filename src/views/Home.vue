<template>
  <div class="home">
    <h2 class="title">Find Modules to Learn.</h2>
    <p class="sub-title">好きなモジュールを組み合わせて、あなた専用のチュートリアルを作ることができます。</p>
    <div class="filters">
      <input
        type="text"
        placeholder="search modules"
        class="search"
        v-model="query"
      >
      <div class="price-range flex">
        <label for="price">price &#x2264 ¥{{ maxPrice }}</label>
        <input
          type="range"
          name="price"
          min="0"
          max="1000"
          step="50"
          v-model="maxPrice"
        >
      </div>
      <div class="order-by flex">
        <label for="order">order by</label>
        <button
          :class="{active: order == 'likes.length'}"
          @click="order = 'likes.length'"
        >likes</button>
        <button
          :class="{active: order == 'price'}"
          @click="order = 'price'"
        >price</button>
        <button
          :class="{active: order == 'createdAt'}"
          @click="order = 'createdAt'"
        >date</button>
      </div>
    </div>
    <section class="list flex">
      <Item
        v-for="item in orderBy(filterBy(filterByPrice(items,maxPrice),query,'content'),order,-1)"
        :key="item.id"
        :data="item"
      />
    </section>
  </div>
</template>

<script>
import { db } from '@/main';
import Item from '@/components/Item.vue';
import Vue2Filters from 'vue2-filters';

export default {
  name: 'home',
  components: {
    Item,
  },
  data() {
    return {
      items: [],
      query: '',
      maxPrice: 500,
      order: 'likes.length',
    };
  },
  firestore() {
    return {
      items: db.collection('items'),
    };
  },
  methods: {
    filterByPrice(items, max) {
      return items.filter(item => item.price <= max);
    },
  },
  mixins: [Vue2Filters.mixin],
};
</script>

<style lang="stylus" scoped>
.title
  text-align center
  font-size 1.8rem
  width 90%
  max-width 400px
  margin 0 auto
.sub-title
  text-align center
  margin 10px auto
  width 90%
  max-width 400px
  font-size .8rem
.filters
  width 90%
  max-width 400px
  margin 20px auto
  font-weight bold
.search
  display block
  border 3px solid #eee
  padding 0 5%
  width 90%
  margin 10px auto
  border-radius 20px
  height 35px
  line-height 35px
  font-size 1rem
  font-weight bold
  &:focus
    border 3px solid #2c3e50
.price-range
  margin 10px 0 0
  padding 0 0 10px
  border-bottom 2px solid #eee
  label
    min-width 100px
  input
    width 100%
    margin 0 0 0 10px
    -webkit-appearance none
    appearance none
    background #eee
    height 3px
    margin-top 11px
    cursor pointer
    &::-webkit-slider-thumb
      -webkit-appearance none
      appearance none
      position relative
      width 18px
      height 18px
      display block
      background #2c3e50
      border-radius 50%
      -webkit-border-radius 50%
      box-shadow 0 0 5px rgba(0,0,0,.5)
.order-by
  margin 10px 0 0
  button
    border 1px solid #eee
    width 60px
    text-align center
    height 28px
    line-height 25px
    margin -3px 2px 0
    border-radius 15px
  .active
    border 1px solid #2c3e50
    background #2c3e50
    color white
    font-weight bold
  label
    min-width 100px
</style>
