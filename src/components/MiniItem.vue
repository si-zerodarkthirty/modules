<template>
  <div class="mini-item flex">
    <div
      class="thumbnail"
      :style="'background-image: url('+data.thumbnail+');'"
    ></div>
    <a :href="'/module/'+data.user+'/'+id">
      <p class="title">{{ data.title }}</p>
    </a>
  </div>
</template>

<script>
import { db } from '@/main';

export default {
  props: ['id'],
  data() {
    return {
      data: {},
    };
  },
  firestore() {
    return {
      data: db.collection('items').doc(this.$props.id),
    };
  },
};
</script>

<style lang="stylus" scoped>
.mini-item
  cursor pointer
  padding 10px
  .thumbnail
    width 50px
    height 50px
    min-height 50px
    min-width 50px
    border-radius 50%
    background-size cover
    background-position center
    border 3px solid #2c3e50
  .title
    margin 0 0 0 10px
    font-size .9rem
    line-height 1.5rem
</style>
