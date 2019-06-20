<template>
  <div class="home">
    <h2 class="title">どんなスキルをImportしますか？</h2>
    <input 
      type="text"
      placeholder="Search Tutorials"
      class="search"
    >
    <section class="list flex">
      <Item 
        v-for="item in items"
        :key="item.id"
        :data="item"
      />
    </section>
  </div>
</template>

<script>
import { db } from "@/main" 
import Item from "@/components/Item"
export default {
  name: 'home',
  components: {
    Item
  },
  data () {
    return {
      items: []
    }
  },
  firestore () {
    return {
      items: db.collection("items").orderBy("createdAt","desc")
    }
  }
};
</script>

<style lang="stylus" scoped>
.title
  text-align center
  font-size 1.5rem
.search
  display block
  box-shadow 0 0 5px #eee
  border none
  padding 0 2%
  width 46%
  margin 20px auto
  border-radius 20px
  height 40px
  line-height 40px
  font-size 1rem
</style>

