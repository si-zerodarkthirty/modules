<template>
  <div id="app">
    <Header />
    <main>
      <div v-if="isLoading" class="loader">
        <rotate-loader
          :loading="isLoading"
          color="#2c3e50"
        ></rotate-loader>
      </div>
      <router-view v-else />
    </main>
    <Footer />
  </div>
</template>

<script>
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RotateLoader from 'vue-spinner/src/RotateLoader.vue';

export default {
  components: {
    Header,
    Footer,
    RotateLoader,
  },
  data() {
    return {
      entered: false,
      isLoading: false,
    };
  },
  watch: {
    entered() {
      this.entered ? this.enter() : this.leave();
    },
  },
  mounted() {
    this.$router.beforeResolve((to, from, next) => {
      this.entered = true;
      next();
    });
    this.$router.afterEach((to, from, next) => {
      setTimeout(() => {
        this.entered = false;
      }, 2000);
    });
  },
  methods: {
    enter() {
      this.isLoading = true;
    },
    leave() {
      this.isLoading = false;
    },
  },
};
</script>

<style lang="stylus">
@import url('https://fonts.googleapis.com/css?family=Quicksand:400,700&display=swap');

:link, :visited
  text-decoration none
  color inherit
::selection
  background #2c3e50
  color white
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
.loader
  width fit-content
  margin 0 auto
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
input, textarea
  font-family 'Quicksand', 'Yu Gothic', 'YuGothic', sans-serif
input:focus, textarea:focus
  outline none
.flex
  display flex
  flex-wrap nowrap
  justify-content flex-start
.list
  flex-wrap wrap
  justify-content center
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
.view
  overflow-y scroll
.content, .view
  .table-of-contents
    li
      font-size .9rem
      padding 5px 0
      border-bottom 2px solid #eee
      &:hover
        border-bottom 2px solid #2c3e50
  code
    font-weight bold
  pre
    background #2c3e50
    color white
    padding 10px 15px
    border-radius 5px
    font-weight bold
    font-size 1.2rem
    line-height 1.4rem
    overflow-x scroll
  h3
    margin-top 50px
    padding-bottom 10px
    font-size 1.2rem
    border-bottom 1px solid #eee
  a
    font-weight bold
</style>
