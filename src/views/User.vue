<template>
  <div class="user">
    <div class="user-title flex">
      <div
        v-if="user.avatar"
        class="avatar"
        :style="'background-image: url('+user.avatar+');'"
      ></div>
      <div
        v-else
        class="avatar"
        :style="'background-image: url('+user.photoURL+');'"
      ></div>
      <div class="texts">
        <h2 v-if="user.name">{{ user.name }}</h2>
        <h2 v-else>{{ user.displayName }}</h2>
        <p>created {{ createdItems.length }} modules</p>
      </div>
    </div>
    <nav>
      <button
        :class="{active:activeTab == 'created'}"
        @click="activeTab = 'created'"
      >Created</button>
      <button
        :class="{active:activeTab == 'liked'}"
        @click="activeTab = 'liked'"
      >Liked</button>
      <button
        :class="{active:activeTab == 'settings'}"
        @click="activeTab = 'settings'"
      >Settings</button>
      <button
        @click="signOut"
      >Log Out</button>
    </nav>
    <div v-if="activeTab == 'created'" class="list flex">
      <Item
        v-for="item in orderBy(createdItems,'createdAt',-1)"
        :key="item.id"
        :data="item"
      />
    </div>
    <div v-if="activeTab == 'liked'" class="list flex">
      <Item
        v-for="item in orderBy(likedItems,'createdAt',-1)"
        :key="item.id"
        :data="item"
      />
    </div>
    <div v-if="activeTab == 'settings'" class="editor">
      <label for="name">name（Enterで保存）</label>
      <input
        type="text"
        name="name"
        v-model="user.name"
        @keypress.enter="saveName"
      >
      <label for="avatar">avatar URL（Enterで保存）</label>
      <input
        type="text"
        name="avatar"
        v-model="user.avatar"
        @keypress.enter="saveAvatar"
      >
      <label for="twitter">twitter ID（Enterで保存）</label>
      <input
        type="text"
        name="twitter"
        v-model="user.twitter"
        @keypress.enter="saveTwitter"
      >
    </div>
  </div>
</template>

<script>
import { db, auth } from '@/main';
import Item from '@/components/Item.vue';
import Vue2Filters from 'vue2-filters';

export default {
  components: {
    Item
  },
  data() {
    return {
      user: {},
      likedItems: [],
      createdItems: [],
      activeTab: 'created',
    };
  },
  firestore() {
    return {
      user: db.collection('users').doc(this.$route.params.uid),
      createdItems: db.collection('items').where('user', '==', this.$route.params.uid),
      likedItems: db.collection("items").where("likes","array-contains",this.$route.params.uid)
    };
  },
  methods: {
    saveName() {
      db.collection('users').doc(this.$route.params.uid)
        .set({
          name: this.user.name,
        }, { merge: true })
        .then(
          this.$toasted.show('名前を更新しました。', { duration: 2000 }),
        );
    },
    saveAvatar() {
      db.collection('users').doc(this.$route.params.uid)
        .set({
          avatar: this.user.avatar,
        }, { merge: true })
        .then(
          this.$toasted.show('アイコン画像を更新しました。', { duration: 2000 }),
        );
    },
    saveTwitter() {
      db.collection('users').doc(this.$route.params.uid)
        .set({
          twitter: this.user.twitter,
        }, { merge: true })
        .then(
          this.$toasted.show('Twitter IDを更新しました。', { duration: 2000 }),
        );
    },
    signOut() {
      if (window.confirm('ログアウトしてよろしいですか？')) {
        auth.signOut()
          .then(
            this.$toasted.show('ログアウトしました。', { duration: 2000 }),
            this.$router.push('/'),
          );
      }
    },
  },
  mixins: [Vue2Filters.mixin],
};
</script>

<style lang="stylus" scoped>
.user-title
  .avatar
    height 50px
    width 50px
    border-radius 50%
    background-size cover
    border 2px solid #2c3e50
  .texts
    margin-left 10px
    h2
      margin 0
    p
      margin 0
nav
  margin 20px 0
  width fit-content
  button
    padding 10px 0
    width 70px
    border-bottom 3px solid #eee
  .active
    border-bottom 3px solid #2c3e50
    font-weight bold
</style>
