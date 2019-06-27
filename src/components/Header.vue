<template>
  <header>
    <div class="flex">
      <router-link to="/">
        <p class="title">
          <fa class="logo" icon="puzzle-piece" />
          modules.
        </p>
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
            icon="puzzle-piece"
          />
          new module
        </button>
      </router-link>
      <button
        class="create-btn"
        :class="{selected: isVisible}"
        @click="isVisible = !isVisible"
      >
        <fa
          icon="layer-group"
        />
        new tutorial
      </button>
    </nav>
    <div
      v-if="isVisible"
      class="set-box"
    >
      <input
        type="id"
        placeholder="tutorial name"
        v-model="tutorialName"
        @keypress.enter="setItem"
        class="input-name"
        autofocus
      >
      <input
        type="id"
        placeholder="paste module ID and press enter."
        v-model="itemId"
        @keypress.enter="setItem"
        class="input-id"
      >
      <SetItem
        v-for="(itemId,idx) in setItems"
        :key="idx"
        :id="itemId"
        :index="idx"
        @remove="removeItem(idx)"
        isEdit=true
      />
      <button
        class="create-tutorial"
        @click="createTutorial"
      >
        Create Tutorial
      </button>
    </div>

  </header>
</template>

<script>
import firebase from 'firebase';
import { db, auth } from '@/main';
import SetItem from '@/components/SetItem';

export default {
  components: {
    SetItem,
  },
  data() {
    return {
      currentUser: {},
      isVisible: false,
      setItems: [],
      itemId: '',
      tutorialName: 'my tutorial',
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
        email: user.email,
      }, { merge: true });
    },
    setItem() {
      this.setItems.push(this.itemId)
        .then(
          this.itemId = '',
        );
    },
    removeItem(i) {
      this.setItems.splice(i, 1);
    },
    createTutorial() {
      if (this.setItems.length > 1) {
        const date = this.$date(new Date(), 'DD.MMMM.YYYY');
        db.collection('tutorials').add({
          user: this.currentUser.uid,
          modules: this.setItems,
          name: this.tutorialName,
          createdAt: date,
          likes,
        }).then((item) => {
          this.$toasted.show('tutorialが公開されました！', { duration: 2000 }),
          this.$router.push(`/tutorial/${this.currentUser.uid}/${item.id}`),
          this.tutorialName = null,
          this.setItems = null;
        });
      } else {
        this.$toasted.show('2つ以上のmoduleを登録してください。', { duration: 2000 });
      }
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
  .selected
    background #2c3e50
    color white
  .set-box
    position fixed
    top 60px
    right 20px
    background white
    box-shadow 0 0 10px rgba(0,0,0,.1)
    border-radius 5px
    width 250px
    overflow hidden
    .title
      font-size 1rem
      padding 10px
    input
      width 96%
      padding 0 2%
      border none
      font-weight bold
      line-height 2rem
    .input-name
      font-size 1rem
    .input-id
      background #eee
      border none
      font-size .8rem
    .create-tutorial
      background #2c3e50
      color white
      text-align center
      width 100%
      padding 0
      margin 0
      font-weight bold
      height 40px
      line-height 40px
</style>
