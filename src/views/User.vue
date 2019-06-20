<template>
  <div class="user">
    <div class="user-title flex">
      <div 
        class="avatar"
        :style="'background-image: url('+user.photoURL+');'"
      ></div>
      <div class="texts">
        <h2>{{ user.name }}</h2>
      </div>
    </div>
    <p>{{ user.name }}さんが公開しているSkills</p>
    <div class="list">
      <Item 
        v-for="item in items"
        :key="item.id"
        :data="item"
      />
    </div>
  </div>
</template>

<script>
import { db, auth } from "@/main"
import Item from "@/components/Item"
export default {
  components: {
    Item
  },
  data () {
    return {
      user: {},
      items: []
    }
  },
  firestore () {
    return {
      user: db.collection("users").doc(this.$route.params.uid),
      items: db.collection("items").where("user","==",this.$route.params.uid)
    }
  }
}
</script>

<style lang="stylus" scoped>
.avatar
  height 50px
  width 50px
  border-radius 50%
  background-size cover
</style>
