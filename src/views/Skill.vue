<template>
  <div class="skill">
    <div 
      class="thumbnail"
      :style="'background-image: url('+skill.thumbnail+');'"
    >
      <h1>{{ skill.title }}</h1>
    </div>
  </div>
</template>

<script>
import { db } from "@/main" 
export default {
  data () {
    return {
      skill: {}
    }
  },
  firestore () {
    return {
      skill: db.collection("items").doc(this.$route.params.id)
    }
  }
}
</script>

<style lang="stylus" scoped>
.thumbnail
  width 104%
  margin-left -2%
  height 400px
  margin-top -100px
  text-align center
  background-size cover
  position relative
  h1
    position absolute
    top 160px
    left 50%
    width 70%
    margin-left -35%
    background black
    color white
    border-radius 5px
    padding 20px 0
</style>

