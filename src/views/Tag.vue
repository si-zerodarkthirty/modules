<template>
  <div class="tag">
    <div class="title">
      <h1># {{ $route.params.tag }}</h1>
      <p>を含むmodule</p>
    </div>
    <section class="list flex">
      <Item
        v-for="item in orderBy(items,'updatedAt',-1)"
        :key="item.id"
        :data="item"
      />
    </section>
  </div>
</template>

<script>
import { db } from "@/main"
import Item from "@/components/Item"
import Vue2Filters from 'vue2-filters';

export default {
  components: {
    Item
  },
  data() {
    return {
      items: []
    }
  },
  firestore() {
    return {
      items: db.collection("items").where("keywords","array-contains",this.$route.params.tag)
    }
  },
  mixins: [Vue2Filters.mixin],
}
</script>

<style lang="stylus" scoped>
.tag
  .title
    text-align center
    margin 20px 0
    h1
      margin 0
    p 
      margin 0
      font-size .9rem
</style>


