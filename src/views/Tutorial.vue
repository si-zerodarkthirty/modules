<template>
  <div class="tutorial">
    <div class="texts">
      <div
        class="menu-btn"
        v-if="currentUser && currentUser.uid === $route.params.uid"
        @click="isVisible = !isVisible"
      >
        <fa
          icon="ellipsis-v"
        />
      </div>
      <div
        v-if="isVisible"
        class="menu"
      >
        <router-link :to="'/update-tutorial/'+tutorial.user+'/'+tutorial.id">
          <p>編集する</p>
        </router-link>
        <p @click="deleteTutorial">削除する</p>
      </div>
      <h1>{{ tutorial.name }}</h1>
      <div 
        v-if="tutorial.thumbnail"
        class="thumbnail"
        :style="'background-image: url('+tutorial.thumbnail+');'"
      ></div>
      <UserData
        :uid="$route.params.uid"
        :date="tutorial.createdAt"
      />
    </div>
    <nav 
      id="page-nav"
      class="page-nav"
    >
      <button 
        @click="activeIdx = 0"
        :class="{active: activeIdx == 0}"
      >
        Intro
      </button>
      <button 
        v-for="(moduleId,idx) in tutorial.modules"
        :key="idx"
        @click="activeIdx = idx+1, getModule(moduleId)"
        :class="{active: activeIdx == idx+1}"
      >
        module {{idx + 1}}
      </button>
    </nav>
    <div v-if="activeIdx == 0">
      <div class="body">
        <div
          class="view"
          v-html="md.render(tutorial.intro)"
        ></div>
      </div>
    </div>
    <ModuleBody 
      v-else
      :data="activeModule"
      :idx="activeIdx"
    />
  </div>
</template>

<script>
import { auth, db } from '@/main';
import UserData from '@/components/UserData';
import ModuleBody from '@/components/ModuleBody';
import markdownIt from 'markdown-it';
import hljs from 'highlight.js';
import sanitizer from 'markdown-it-sanitizer';
import markdownItAnchor from 'markdown-it-anchor';
import markdownItTocDoneRight from 'markdown-it-toc-done-right';
import katex from '@iktakahiro/markdown-it-katex';

export default {
  components: {
    UserData,
    ModuleBody
  },
  data() {
    return {
      scrollY: 0,
      isVisible: false,
      currentUser: {},
      user: {},
      tutorial: {},
      activeIdx: 0,
      activeModule: {},
      md: new markdownIt({
        highlight(code, lang) {
          return hljs.highlightAuto(code, [lang]).value;
        },
        html: true,
        linkify: true,
        breaks: true,
        xhtmlOut: true,
        typographer: true,
      })
        .use(sanitizer)
        .use(markdownItAnchor, {
          permalink: true,
          permalinkBefore: true,
          permalinkSymbol: '§',
        })
        .use(markdownItTocDoneRight)
        .use(katex, { throwOnError: false, errorColor: ' #cc0000' }),
    };
  },
  created() {
    auth.onAuthStateChanged((user) => {
      this.currentUser = user;
    });
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  firestore() {
    return {
      tutorial: db.collection("tutorials").doc(this.$route.params.id),
      user: db.collection("users").doc(this.$route.params.uid)
    };
  },
  methods: {
    handleScroll() {
      const pageNav = document.getElementById('page-nav')
      if(window.scrollY > 350) {
        pageNav.style.position = 'fixed'
        pageNav.style.top = '30px'
      } else {
        pageNav.style.position = 'relative'
        pageNav.style.top = 'auto'
      }
    },
    getModule(id) {
      db.collection("items").doc(id)
      .get()
      .then(item => {
        this.activeModule = item.data()
      })
    },
    deleteTutorial() {
      if(window.confirm('tutorialを削除してよろしいですか？')) {
        db.collection("tutorials").doc(this.$route.params.id)
        .delete()
        .then(
          this.$toasted.show('tutorialが削除されました。', { duration: 2000 }),
          this.$router.push('/'),
        )
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
.tutorial
  .texts
    width 95%
    max-width 500px
    border-radius 5px
    padding 10px 0 0
    margin 0 auto
    background white
    box-shadow 0 0 10px rgba(0,0,0,.2)
    overflow hidden
    position relative
    h1
      font-size 1.2rem
      margin 10px 15px 20px
    .thumbnail
      height 150px
      width 100%
      background-size cover
      background-position center
    .menu-btn
      position absolute
      top 8px
      right 5px
      width 30px
      height 30px
      border-radius 50%
      line-height 30px
      cursor pointer
      text-align center
      &:hover
        background rgba(0,0,0,.1)
    .menu
      position absolute
      top 40px
      right 10px
      background white
      box-shadow 0 0 10px rgba(0,0,0,.2)
      border-radius 5px
      p
        margin 0
        font-size .8rem
        font-weight bold
        padding 8px 16px
        cursor pointer
        &:hover
          background #eee
        &:first-child
          border-bottom 1px solid #eee
</style>
