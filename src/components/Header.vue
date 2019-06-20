<template>
  <header>

    <div class="flex">
      <router-link to="/">
        <p class="title">skillHunter.</p>
      </router-link>
      <button 
        class="img-btn">
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
      <router-link to="/editor">
        <button>New Skillを作成</button>
      </router-link>
    </nav>

  </header>
</template>

<script>
import firebase from "firebase"
import { db } from "@/main"
import { auth } from "@/main"
export default {
  data () {
    return {
      currentUser: {}
    }
  },
  created () {
    auth.onAuthStateChanged(user => {
      this.currentUser = user
    })
  },
  methods: {
    signIn () {
      const provider = new firebase.auth.GoogleAuthProvider()
      auth.signInWithPopup(provider)
      .then((result) => {
        alert('Hello, '+result.user.displayName+'!')
        this.createUser(result.user) 
      })
    },
    createUser (user) {
      db.collection('users').doc(user.uid).set({
        'name': user.displayName,
        'photoURL': user.photoURL,
        'email':user.email
      }, { merge: true })
    }
  }
}
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
  background rgba(255,255,255,.5)
  z-index 100
  .title
    margin 0
    font-size 1.5rem
    font-weight bold
  button
    margin-left 5px
</style>

