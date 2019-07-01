<template>
  <footer>
    <div class="logo-wrapper">
      <img 
        src="../assets/logo.svg" 
        alt="logo"
        class="logo"
      >
      <p class="logo-text">modules.</p>
    </div>
    <!--
    <div class="links">
      <button>ヘルプ</button>
      <button>サポート</button>
    </div>
    -->
    <p class="cr">Copyright 2019. modules. All rights Reserved.</p>
  </footer>
</template>

<style lang="stylus" scoped>
footer
  background #eee
  color #2c3e50
  text-align center
  padding 10px 0 3px
  margin-top 50px
  .logo
    width 80px
    margin 30px 0 0
  .logo-text
    font-size 1.5rem
    font-weight bold
    margin-top 0
  .cr
    font-size .8rem
</style>
