<template>
  <div class="home">
    <div class="logos flex">
      <fa
        class="logo"
        icon="puzzle-piece"
        :class="{active: moduleIsVisible}"
        @click="moduleIsVisible = true"
      />
      <fa
        class="logo"
        icon="layer-group"
        :class="{active: !moduleIsVisible}"
        @click="moduleIsVisible = false"
      />
    </div>
    <div v-if="moduleIsVisible">
      <h1 class="title">find modules</h1>
      <p class="sub-title">好きなmoduleを組み合わせて、あなた専用のtutorialを作ることができます。</p>
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
          ><fa icon="heart" /></button>
          <button
            :class="{active: order == 'price'}"
            @click="order = 'price'"
          ><fa icon="yen-sign" /></button>
          <button
            :class="{active: order == 'updatedAt'}"
            @click="order = 'updatedAt'"
          ><fa icon="clock" /></button>
          <button
            v-if="dir == -1"
            class="active"
            @click="dir = 0"
          ><fa icon="arrow-up" /></button>
          <button
            v-else
            @click="dir = -1"
          ><fa icon="arrow-down" /></button>
        </div>
      </div>
    </div>
    <div v-else>
      <h1 class="title">find tutorials</h1>
      <p class="sub-title">他の人が組み立てたtutorialにしたがって学習することができます。</p>
      <div class="filters">
        <input
          type="text"
          placeholder="search tutorials"
          class="search"
          v-model="query"
        >
        <div class="order-by flex">
          <label for="order">order by</label>
          <button
            :class="{active: order == 'likes.length'}"
            @click="order = 'likes.length'"
          ><fa icon="heart" /></button>
          <button
            :class="{active: order == 'updatedAt'}"
            @click="order = 'updatedAt'"
          ><fa icon="clock" /></button>
          <button
            v-if="dir == -1"
            class="active"
            @click="dir = 0"
          ><fa icon="arrow-up" /></button>
          <button
            v-else
            @click="dir = -1"
          ><fa icon="arrow-down" /></button>
        </div>
      </div>
    </div>
    <section class="list flex" v-if="moduleIsVisible">
      <Item
        v-for="item in orderBy(filterBy(filterByPrice(items,maxPrice),query,'content'),order,dir)"
        :key="item.id"
        :data="item"
      />
    </section>
    <section class="list flex" v-else>
      <TutorialItem
        v-for="item in orderBy(filterBy(tutorials,query,'name'),order,dir)"
        :key="item.id"
        :data="item"
      />
    </section>
  </div>
</template>

<script>
import { db } from '@/main';
import Item from '@/components/Item.vue';
import TutorialItem from '@/components/TutorialItem.vue';
import Vue2Filters from 'vue2-filters';

export default {
  name: 'home',
  head: {
    title: {
      inner: 'Home',
      separator: '|',
      complement: 'modules - あなた専用のチュートリアルで学ぼう。',
    },
    meta: [
      { name: 'description', content: 'modulesは全く新しいプログラミング学習サイトです。modulesでは、１機能・１トピック単位でチュートリアルを売買できます。' },
    ],
  },
  components: {
    Item,
    TutorialItem,
  },
  data() {
    return {
      items: [],
      query: '',
      maxPrice: 500,
      order: 'likes.length',
      dir: -1,
      moduleIsVisible: true,
    };
  },
  firestore() {
    return {
      items: db.collection('items'),
      tutorials: db.collection('tutorials'),
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
.logos
  width 150px
  margin 10px auto
  font-size 4rem
  justify-content space-between
  .logo
    color #eee
    cursor pointer
  .active
    color #2c3e50
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
  font-weight bold
.filters
  width 90%
  max-width 450px
  margin 20px auto 50px
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
    min-width 110px
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
.order-by
  margin 10px 0 0
  button
    border 1px solid #eee
    width 60px
    text-align center
    height 28px
    line-height 26px
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
