<template>
  <div class="keywords">
    <span 
      class="keyword"
      v-for="(keyword,idx) in keywords"
      :key="idx"
    >
      # {{keyword}}
    </span>
  </div>
</template>

<script>
export default {
  props: ["keywords"]
}
</script>

<style lang="stylus" scoped>
.keywords
  margin 10px 15px
  span
    display inline-block
    font-size .8rem
    border 1px solid #2c3e50
    margin 3px 3px 3px 0
    padding 0 8px
    width fit-content
    height 20px
    line-height 20px
    border-radius 20px
</style>


