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
      }, 500);
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
  display block
  border none
  margin 0
  padding 0 2%
  width 96%
  font-size 1rem
textarea
  padding 20px 2%
input
  height 45px
  line-height 45px
  border-radius 5px
  background #eee
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
    width 38px
    height 38px
    background-size cover
    border-radius 5px
  &:focus
    outline none
.md-editor
  height 400px
  width 104%
  margin 10px 0 0 -2%
  border-top 3px solid #eee
  border-bottom 3px solid #eee
  textarea
    resize none
    background #eee
    width 46%
    min-width 46%
    margin 0
  .view
    padding 0 15px
    overflow-y scroll
    min-width 47%
.md-editor.sp
  height 300px
  overflow-y scroll
  textarea
    width 96%
    height 300px
    padding 20px 2%
.view
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
    overflow scroll
    max-height 400px
    font-family "Lucida Console", Monaco, monospace
  h3
    margin-top 50px
    padding-bottom 10px
    font-size 1.2rem
    border-bottom 1px solid #eee
  a
    font-weight bold
  img
    width 100%
    box-shadow 0 0 10px rgba(0,0,0,.2)
    border-radius 3px
  table
    margin 20px auto
    border-collapse collapse
    font-size .85rem
    th
      border-bottom 3px solid #2c3e50
      padding 5px 10px
    td
      padding 5px 10px
.page-nav
  margin 20px 0
  width fit-content
  transition all .2s
  z-index 100
  button
    padding 10px 0
    width 75px
    border-bottom 3px solid #eee
    color #2c3e50
  .active
    border-bottom 3px solid #2c3e50
    font-weight bold
.body
  max-width 550px
  width 95%
  margin 50px auto
  font-size 1rem
  line-height 1.8rem
  .description
    border 5px solid #2c3e50
    padding 3px 18px
    font-size .9rem
    font-weight bold
    margin-bottom 50px
    h3
      margin 10px 0
      font-size 1.2rem
.sp
  display none
@media (max-width: 768px)
  .sp
    display inline-block
  .pc
    display none
</style>

