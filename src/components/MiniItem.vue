<template>
  <div class="mini-item flex">
    <div
      class="thumbnail"
      :style="'background-image: url('+data.thumbnail+');'"
    >
      <div
        v-if="isDone"
        class="done-icon"
      >
        <fa
          icon="check"
        />
      </div>
    </div>
    <router-link :to="'/module/'+data.user+'/'+id">
      <p class="title">{{ data.title }}</p>
    </router-link>
  </div>
</template>

<script>
import { auth, db } from '@/main';

export default {
  props: ['id'],
  data() {
    return {
      data: {},
      isDone: false,
    };
  },
  created() {
    auth.onAuthStateChanged((user) => {
      db.collection('items')
        .doc(this.$props.id)
        .onSnapshot((item) => {
          const isDone = item.data().dones.find(done => done == user.uid);
          if (isDone) {
            this.isDone = true;
          } else {
            this.isDone = false;
          }
        });
    });
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
    position relative
    overflow hidden
    .done-icon
      height 50px
      line-height 50px
      position absolute
      top 0
      width 100%
      text-align center
      z-index 10
      color white
      background #2c3e50
      opacity .9
  .title
    margin 0 0 0 10px
    font-size .9rem
    line-height 1.5rem
</style>
