<template>
  <header>
    <div class="flex">
      <router-link to="/">
        <h1 class="title flex">
          <img
            src="../assets/logo.svg"
            alt="modules-logo"
            class="logo"
          >
          <p>modules.</p>
        </h1>
      </router-link>
    </div>
    <nav class="flex">
      <router-link
        v-if="currentUser"
        to="/create"
      >
        <button class="create-btn">
          <fa
            icon="puzzle-piece"
          />
          <span>new module</span>
        </button>
      </router-link>
      <button
        v-if="currentUser"
        class="create-btn"
        :class="{selected: isVisible}"
        @click="isVisible = !isVisible"
      >
        <fa
          icon="layer-group"
        />
        <span>new tutorial</span>
      </button>
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
        placeholder="module IDを入力しEnterキーを押すと追加されます。"
        v-model="inputId"
        @keypress.enter="setItem"
        class="input-id"
      >
      <button
        class="cancel-btn"
        v-if="setItems.length > 0"
        @click="cancelItems"
      >
        cancel all
      </button>
      <draggable @end="onEnd">
        <SetItem
          v-for="moduleItem in setItems"
          :key="moduleItem.id"
          :id="moduleItem.id"
          :num="moduleItem.num"
        />
      </draggable>
      <button
        class="create-tutorial"
        @click="createTutorial"
      >
        publish this tutorial
      </button>
    </div>

  </header>
</template>

<script>
import firebase from 'firebase';
import { db, auth } from '@/main';
import SetItem from '@/components/SetItem';
import draggable from 'vuedraggable';

export default {
  components: {
    SetItem,
    draggable,
  },
  data() {
    return {
      currentUser: {},
      isVisible: false,
      setItems: [],
      inputId: '',
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
      db.collection('items').doc(this.inputId)
        .get()
        .then((item) => {
          if (item.exists) {
            this.setItems.push({
              id: this.inputId,
              num: this.setItems.length + 1,
            });
          } else {
            this.$toasted.show('IDが間違っています。', { duration: 2000 });
          }
          this.inputId = '';
        });
    },
    cancelItems() {
      if (window.confirm('moduleのリストを空にしてよろしいですか？')) {
        this.setItems = [];
      }
    },
    createTutorial() {
      if (this.setItems.length > 1) {
        const date = this.$date(new Date(), 'DD.MMMM.YYYY');
        db.collection('tutorials').add({
          user: this.currentUser.uid,
          modules: this.setItems,
          name: this.tutorialName,
          createdAt: date,
          likes: [],
          intro: '',
          thumbnail: '',
        }).then((item) => {
          this.$toasted.show('tutorialが公開されました！', { duration: 2000 }),
          this.$router.push(`/tutorial/${this.currentUser.uid}/${item.id}`),
          this.tutorialName = '',
          this.setItems = [];
        });
      } else {
        this.$toasted.show('2つ以上のmoduleを登録してください。', { duration: 2000 });
      }
    },
    onEnd() {
      const rawItems = document.getElementsByClassName('set-item');
      const items = [].slice.call(rawItems);
      this.setItems.forEach((moduleItem) => {
        const moduleElement = document.getElementById(`item${moduleItem.num}`);
        moduleItem.num = items.indexOf(moduleElement) + 1;
      });
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
    font-weight bold
    p
      margin 3px 0 0 5px
      font-size 1.2rem
    img
      width 2rem
      height 2rem
  button
    margin-left 5px
  .img-btn
    padding 0
  .create-btn
    background #eee
    padding 10px 12px
    border-radius 5px
    font-weight bold
    &:hover
      background #2c3e50
      color white
    span
      margin-left 5px
  .selected
    background #2c3e50
    color white
  .set-box
    position fixed
    top 60px
    right 10px
    background white
    box-shadow 0 0 10px rgba(0,0,0,.1)
    border-radius 5px
    width 90%
    max-width 400px
    overflow hidden
    .set-item
      cursor move
    input
      width 96%
      padding 0 2%
      border none
      font-weight bold
      line-height 2rem
      background white
      border-radius 0
    .input-name
      font-size 1.2rem
      padding 3px 8px
    .input-id
      background #eee
      border none
      font-size .8rem
    .cancel-btn,
      text-align center
      width 100%
      padding 0
      margin 0
      font-weight bold
      height 40px
      line-height 40px
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
@media (max-width: 768px)
  header
    .create-btn
      span
        display none
</style>
