<template>
  <div class="item">
    <div 
      class="thumbnail"
      :style="'background-image: url('+data.thumbnail+');'"
    ></div>
    <router-link :to="'/skill/'+data.id">
      <h2>{{ data.title }}</h2>
    </router-link>
    <div class="keywords">
      <span 
        v-for="keyword in data.keywords"
        :key="keyword.id"
      >
        {{ keyword }}
      </span>
    </div>
    <div 
      class="user flex"
      @click="$router.push('/user/'+data.user)"
    >
      <div 
        class="avatar"
        :style="'background-image: url('+user.photoURL+');'"
      ></div>
      <div class="texts">
        <p class="user-name">{{ user.name }}</p>
        <p class="date">{{ data.createdAt }}</p>
      </div>
    </div>
    <p class="price">¥ {{ data.price }}</p>
  </div>
</template>

<script>
import { db } from "@/main"
export default {
  props: ["data"],
  data () {
    return {
      user: {}
    }
  },
  firestore () {
    return {
      user: db.collection("users").doc(this.$props.data.user)
    }
  }
}
</script>

<style lang="stylus" scoped>
.item
  box-shadow 0 0 5px #eee
  border-radius 5px
  width 280px
  margin 10px
  overflow hidden
  .thumbnail
    height 200px
    width 100%
    background-size cover
  h2
    font-size 1rem
    margin 10px 15px 0
  .keywords
    margin 10px 15px
    span
      display inline-block
      font-size .85rem
      border 1px solid #555
      margin 3px 3px 3px 0
      padding 0 8px
      width fit-content
      height 20px
      line-height 20px
      border-radius 20px
  .user
    margin 0 15px 15px
    cursor pointer
    .avatar
      width 35px
      height 35px
      border-radius 50%
      background-size cover
      margin-right 5px
    .texts
      p
        margin 0
        font-size .8rem
      .user-name
        font-size 1rem
  .price
    padding 15px
    margin 0
    background black
    color white
    text-align center
</style>


