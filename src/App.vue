<template>
  <div id="app">
    <Header />
    <main>
      <router-view/>
    </main>
    <Footer />
  </div>
</template>

<script>
import Header from "@/components/Header"
import Footer from "@/components/Footer"
export default {
  components: {
    Header,
    Footer
  }
}
</script>

<style lang="stylus">
@import url('https://fonts.googleapis.com/css?family=Quicksand:400,700&display=swap');

:link, :visited
  text-decoration none
  color inherit
body
  margin 0
  font-family 'Quicksand', 'Yu Gothic', 'YuGothic', sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  color #2c3e50
main
  padding 0 2%
  margin-top 100px
  min-height 500px
  position relative
button
  border none
  font-size .9rem
  font-family 'Quicksand', 'Yu Gothic', 'YuGothic', sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  background transparent
  cursor pointer
  &:focus
    outline none
input:focus, textarea:focus
  outline none
.flex
  display flex
  flex-wrap nowrap
  justify-content flex-start
.img-btn
  border none
  font-size 1.5rem
  cursor pointer
  background transparent
  .img
    width 30px
    height 30px
    background-size cover
    border-radius 50%
  &:focus
    outline none
</style>
