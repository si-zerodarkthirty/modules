<template>
  <div class="tutorial-item">
    <div
      class="like-icon"
      :class="{isLiked: isLiked}"
      @click="toggleLike"
    >
      <fa
        icon="heart"
      />
      <p>{{data.likes.length}}</p>
    </div>
    <router-link :to="'/tutorial/'+data.user+'/'+data.id">
      <h2>
        {{ data.name }}
        <span>{{data.modules.length}} modules</span>
      </h2>
    </router-link>
    <div class="modules">
      <SetItem
        v-for="(itemId,idx) in data.modules"
        :key="idx"
        :id="itemId"
        :index="idx"
      />
    </div>
  </div>
</template>

<script>
import { db, auth } from '@/main';
import firebase from 'firebase';
import SetItem from '@/components/SetItem';
import UserData from '@/components/UserData';

export default {
  props: ['data'],
  data() {
    return {
      currentUser: {},
      isLiked: false,
    };
  },
  components: {
    UserData,
    SetItem,
  },
  created() {
    auth.onAuthStateChanged((user) => {
      this.currentUser = user;
      db.collection('tutorials')
        .doc(this.$props.data.id)
        .onSnapshot((item) => {
          const isLiked = item.data().likes.find(like => like == user.uid);
          if (isLiked) {
            this.isLiked = true;
          } else {
            this.isLiked = false;
          }
        });
    });
  },
  methods: {
    toggleLike() {
      if (this.currentUser) {
        if (this.isLiked) {
          db.collection('tutorials')
            .doc(this.$props.data.id)
            .update({
              likes: firebase.firestore.FieldValue.arrayRemove(this.currentUser.uid),
            });
          this.$props.data.likes.length -= 1;
        } else {
          db.collection('tutorials')
            .doc(this.$props.data.id)
            .update({
              likes: firebase.firestore.FieldValue.arrayUnion(this.currentUser.uid),
            });
          this.$props.data.likes.length += 1;
        }
      } else {
        this.$toasted.show('likeするにはサインインが必要です。', { duration: 2000 });
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
.tutorial-item
  box-shadow 0 0 10px rgba(0,0,0,.1)
  border-radius 5px
  width 360px
  min-width 360px
  margin 10px
  overflow hidden
  position relative
  .like-icon
    position absolute
    top 6px
    right 10px
    z-index 10
    color white
    text-align center
    cursor pointer
    p
      margin 0
      font-size .8rem
      font-weight bold
  .isLiked
    color #ff0090
  h2
    font-size 1rem
    margin 0
    padding 10px 25px 10px 15px
    background #2c3e50
    color white
    span
      font-size .8rem
      display inline-block
      background white
      color #2c3e50
      padding 0 10px
      height 20px
      line-height 20px
      border-radius 10px
      margin 5px 0 0
  .user
    justify-content center
</style>
