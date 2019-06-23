<template>
  <header>
    <div class="flex">
      <router-link to="/">
        <p class="title">modules.</p>
      </router-link>
      <button
        class="img-btn signin-btn">
        <div
          v-if="currentUser"
          class="img"
          :style="'background-image: url('+currentUser.photoURL+');'"
          @click="$router.push('/user/'+currentUser.uid)"
        ></div>
        <fa
          v-else
          icon="user"
          @click="signIn"
        />
      </button>
    </div>
    <nav class="flex">
      <router-link to="/create">
        <button class="create-btn">
          <fa 
            icon="code" 
          />
          create new
        </button>
      </router-link>
    </nav>

  </header>
</template>

<script>
import firebase from 'firebase';
import { db, auth } from '@/main';

export default {
  data() {
    return {
      currentUser: {},
    };
  },
  created() {
    auth.onAuthStateChanged((user) => {
      this.currentUser = user;
    });
  },
  methods: {
    signIn() {
      const provider = new firebase.auth.GoogleAuthProvider();
      auth.signInWithPopup(provider)
        .then((result) => {
          alert(`Hello, ${result.user.displayName}!`);
          this.createUser(result.user);
        });
    },
    createUser(user) {
      db.collection('users').doc(user.uid).set({
        displayName: user.displayName,
        photoURL: user.photoURL,
        email: user.email
      }, { merge: true });
    },
  },
};
</script>


<style lang="stylus" scoped>
header
  padding 15px 2%
  display flex
  flex-wrap nowrap
  justify-content space-between
  position fixed
  top 0
  width 96%
  z-index 100
  .title
    margin 0
    font-size 1.4rem
    font-weight bold
  button
    margin-left 5px
  .signin-btn
    margin-top -10px
  .create-btn
    background #eee
    padding 10px
    border-radius 5px
    font-weight bold
    &:hover
      background #2c3e50
      color white
</style>
