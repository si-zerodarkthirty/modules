<template>
  <div
    class="user flex"
    @click="$router.push('/user/'+uid)"
  >
    <div
      v-if="user.avatar"
      class="avatar"
      :style="'background-image: url('+user.avatar+');'"
    ></div>
    <div
      v-else
      class="avatar"
      :style="'background-image: url('+user.photoURL+');'"
    ></div>
    <div class="texts">
      <p v-if="user.name" class="user-name">{{ user.name }}</p>
      <p v-else class="user-name">{{ user.displayName }}</p>
      <p class="date">{{ createdAt }}</p>
    </div>
  </div>
</template>

<script>
import { db } from "@/main"
export default {
  props: ["uid","createdAt"],
  data () {
    return {
      user: {}
    }
  },
  firestore () {
    return {
      user: db.collection("users").doc(this.$props.uid)
    }
  }
}
</script>

<style lang="stylus" scoped>
.user
  margin 0 15px 15px
  text-align left
  cursor pointer
  .avatar
    width 35px
    height 35px
    border-radius 50%
    background-size cover
    margin-right 5px
    border 1px solid #2c3e50
  .texts
    p
      margin 0
      font-size .8rem
      font-weight bold
    .user-name
      font-size 1rem
</style>

