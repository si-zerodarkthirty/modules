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
    <h2>
      <router-link :to="'/tutorial/'+data.user+'/'+data.id">
        {{ data.name }}
      </router-link>  
      <span>{{data.modules.length}} modules</span>
    </h2> 
    <div class="modules">
      <SetItem
        v-for="moduleItem in orderBy(data.modules,'num')"
        :key="moduleItem.num"
        :id="moduleItem.id"
        :num="moduleItem.num"
      />
    </div>
  </div>
</template>

<script>
import { db, auth } from '@/main';
import firebase from 'firebase';
import SetItem from '@/components/SetItem';
import UserData from '@/components/UserData';
import Vue2Filters from 'vue2-filters';

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
  mixins: [Vue2Filters.mixin],
};
</script>

<style lang="stylus" scoped>
.tutorial-item
  box-shadow 0 0 10px rgba(0,0,0,.1)
  border-radius 5px
  width 95%
  max-width 380px
  margin 10px
  overflow hidden
  position relative
  .like-icon
    position absolute
    top 10px
    right 15px
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
    padding 15px 30px 15px 15px
    background #2c3e50
    color white
    span
      font-size .8rem
      display inline-block
      background white
      color #2c3e50
      padding 0 12px
      height 20px
      line-height 20px
      border-radius 10px
      margin 0
  .user
    justify-content center
@media (max-width: 768px)
  .tutorial-item
    width 95%
</style>
