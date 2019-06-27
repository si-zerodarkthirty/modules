<template>
  <div class="item">
    <div
      class="thumbnail"
      :style="'background-image: url('+data.thumbnail+');'"
    >
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
      <div
        v-if="isDone"
        class="done-icon"
      >
        <fa
          icon="check"
        />
      </div>
    </div>
    <router-link :to="'/module/'+data.user+'/'+data.id">
      <h2>{{ data.title }}</h2>
    </router-link>
    <Keywords
      :keywords="data.keywords"
    />
    <UserData
      :uid="data.user"
      :date="data.updatedAt"
    />
    <p
      v-if="data.price > 0"
      class="price"
    >¥ {{ data.price }}</p>
    <p
      v-else
      class="price"
    >Free</p>
  </div>
</template>

<script>
import { db, auth } from '@/main';
import firebase from 'firebase';
import UserData from '@/components/UserData';
import Keywords from '@/components/Keywords';

export default {
  props: ['data'],
  data() {
    return {
      currentUser: {},
      isLiked: false,
      isDone: false,
    };
  },
  components: {
    UserData,
    Keywords,
  },
  created() {
    auth.onAuthStateChanged((user) => {
      this.currentUser = user;
      db.collection('items')
        .doc(this.$props.data.id)
        .onSnapshot((item) => {
          const isLiked = item.data().likes.find(like => like == user.uid);
          if (isLiked) {
            this.isLiked = true;
          } else {
            this.isLiked = false;
          }
          const isDone = item.data().dones.find(done => done == user.uid);
          if (isDone) {
            this.isDone = true;
          } else {
            this.isDone = false;
          }
        });
    });
  },
  methods: {
    toggleLike() {
      if (this.currentUser) {
        if (this.isLiked) {
          db.collection('items')
            .doc(this.$props.data.id)
            .update({
              likes: firebase.firestore.FieldValue.arrayRemove(this.currentUser.uid),
            });
        } else {
          db.collection('items')
            .doc(this.$props.data.id)
            .update({
              likes: firebase.firestore.FieldValue.arrayUnion(this.currentUser.uid),
            });
        }
      } else {
        this.$toasted.show('likeするにはサインインが必要です。', { duration: 2000 });
      }
    },
  },
};
</script>

<style lang="stylus">
.item
  box-shadow 0 0 10px rgba(0,0,0,.1)
  border-radius 5px
  width 280px
  min-width 280px
  margin 10px
  padding-bottom 50px
  position relative
  overflow hidden
  position relative
  .thumbnail
    height 150px
    width 100%
    background-size cover
    background-position center
    .done-icon
      position absolute
      top 0
      width 100%
      height 150px
      line-height 150px
      text-align center
      color #2c3e50
      font-size 8rem
      opacity .9
    .like-icon
      position absolute
      top 10px
      right 15px
      text-align center
      cursor pointer
      z-index 10
      p
        margin 0
        font-size .8rem
        font-weight bold
    .isLiked
      color #ff0090
  h2
    font-size 1rem
    margin 10px 15px 0
  .price
    padding 15px 0
    margin 0
    background #2c3e50
    color white
    text-align center
    position absolute
    bottom 0
    width 100%
    font-weight bold
@media (max-width: 768px)
  .item
    width 95%
</style>
