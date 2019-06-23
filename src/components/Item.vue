<template>
  <div class="item">
    <div
      class="thumbnail"
      :style="'background-image: url('+data.thumbnail+');'"
    >
      <div class="likes">
        <fa
          icon="heart"
        />
        <p>{{data.likes.length}}</p>
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
      :createdAt="data.createdAt"
    />
    <p
      v-if="data.price"
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
import UserData from '@/components/UserData';
import Keywords from '@/components/Keywords';

export default {
  props: ['data'],
  data() {
    return {
      currentUser: {},
    };
  },
  components: {
    UserData,
    Keywords,
  },
  created() {
    auth.onAuthStateChanged((user) => {
      this.currentUser = user;
    });
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
    .likes
      position absolute
      top 10px
      right 15px
      color #ff0090
      text-align center
      p
        margin 0
        font-size .8rem
        font-weight bold
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
</style>
