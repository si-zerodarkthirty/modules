<template>
  <li 
    :id="'item'+num"
    class="set-item flex"
  >
    <div class="flex">
      <router-link :to="'/module/'+data.user+'/'+id">
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
      </router-link>
      <p class="title">{{ data.title }}</p>
    </div>
    <div class="flex">
      <div class="index">{{num}}</div>
    </div>
  </li>
</template>

<script>
import { auth, db } from '@/main';

export default {
  props: ['id', 'num'],
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
  }
};
</script>

<style lang="stylus" scoped>
.set-item
  padding 10px
  font-weight bold
  position relative
  border-top 1px solid #eee
  justify-content space-between
  list-style none
  .thumbnail
    width 30px
    height 30px
    min-height 30px
    min-width 30px
    border-radius 50%
    background-size cover
    background-position center
    border 1px solid #2c3e50
    cursor pointer
    position relative
    overflow hidden
    .done-icon
      height 30px
      line-height 30px
      position absolute
      top 0
      width 100%
      text-align center
      z-index 10
      color white
      background #2c3e50
      opacity .9
  .index
    background #2c3e50
    color white
    width 25px
    min-width 25px
    min-height 25px
    height 25px
    border-radius 5px
    text-align center
    line-height 25px
    margin-left 10px
  .title
    margin 0 0 0 5px
    font-size .8rem
    line-height 1rem
  &:first-child
    border none
</style>
