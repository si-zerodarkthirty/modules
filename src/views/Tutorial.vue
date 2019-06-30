<template>
  <div class="tutorial">
    <div class="tools">
      <button
        class="tool"
        @click="toggleLike"
        :class="{isLiked: isLiked}"
      >
        <fa
          icon="heart"
        />
        <span>{{ tutorial.likes.length }}</span>
      </button>
      <a :href="'https://twitter.com/intent/tweet?text=「'+tutorial.name+'」'+'-%20modulesで学ぶ&url=https://modulestore.tech/tutorial/'+tutorial.user+'/'+tutorial.id" target="_blank">
        <button class="tool tweet">
          <fa
            :icon="['fab', 'twitter']"
          />
          <span>tweet</span>
        </button>
      </a>
      <button
        v-if="activeIdx > 0"
        class="tool"
        @click="$router.push('/module/'+activeModule.user+'/'+activeModuleId)"
      >
        <fa
          icon="puzzle-piece"
        />
        <span>module page</span>
      </button>
    </div>
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
        v-for="moduleItem in orderBy(tutorial.modules, 'num')"
        :key="moduleItem.id"
        @click="activeIdx = moduleItem.num, getModule(moduleItem.id)"
        :class="{active: activeIdx == moduleItem.num}"
      >
        module {{moduleItem.num}}
      </button>
    </nav>
    <div v-if="activeIdx == 0">
      <div class="body">
        <div
          class="view"
          v-html="md.render(tutorial.intro)"
        ></div>
        <vue-disqus
          shortname="modules-1"
          :identifier="tutorial.id"
          :url="'https://modulestore.tech/'+tutorial.user+'/'+tutorial.id"
        ></vue-disqus>
      </div>
    </div>
    <ModuleBody 
      v-else
      :data="activeModule"
      :idx="activeIdx"
      :length="tutorial.modules.length"
      @next="getNext"
    />
  </div>
</template>

<script>
import { auth, db } from '@/main';
import firebase from 'firebase';
import UserData from '@/components/UserData';
import ModuleBody from '@/components/ModuleBody';
import markdownIt from 'markdown-it';
import hljs from 'highlight.js';
import sanitizer from 'markdown-it-sanitizer';
import markdownItAnchor from 'markdown-it-anchor';
import markdownItTocDoneRight from 'markdown-it-toc-done-right';
import katex from '@iktakahiro/markdown-it-katex';
import Vue2Filters from 'vue2-filters';

export default {
  components: {
    UserData,
    ModuleBody
  },
  head: {
    title: {
      inner: 'tutorial',
      separator: '|',
      complement: 'modules - あなた専用のチュートリアルで学ぼう。'
    },
    meta: [
      { name: 'description', content: 'modulesは全く新しいプログラミング学習サイトです。modulesでは、１機能・１トピック単位でチュートリアルを売買できます。' },
    ]
  },
  data() {
    return {
      isLiked: false,
      scrollY: 0,
      isVisible: false,
      currentUser: {},
      user: {},
      tutorial: {},
      activeIdx: 0,
      activeModule: {},
      activeModuleId: "",
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
      db.collection('tutorials')
        .doc(this.$route.params.id)
        .onSnapshot((item) => {
          const isLiked = item.data().likes.find(like => like == user.uid);
          if (isLiked) {
            this.isLiked = true;
          } else {
            this.isLiked = false;
          }
        })
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
        this.activeModuleId = item.id
        window.scrollTo(0,300)
      })
    },
    getNext() {
      const nextModule = this.tutorial.modules.find(module => module.num == this.activeIdx + 1)
      db.collection("items").doc(nextModule.id)
      .get()
      .then(item => {
        this.activeModule = item.data()
        this.activeModuleId = item.id
        this.activeIdx += 1
        window.scrollTo(0,300)
      })
    },
    deleteTutorial() {
      if(window.confirm('「'+this.tutorial.name+'」を削除してよろしいですか？')) {
        db.collection("tutorials").doc(this.$route.params.id)
        .delete()
        .then(
          this.$toasted.show('tutorialが削除されました。', { duration: 2000 }),
          this.$router.push('/'),
        )
      }
    },
    toggleLike() {
      if (this.currentUser) {
        if (this.isLiked) {
          db.collection('tutorials')
            .doc(this.$route.params.id)
            .update({
              likes: firebase.firestore.FieldValue.arrayRemove(this.currentUser.uid),
            });
        } else {
          db.collection('tutorials')
            .doc(this.$route.params.id)
            .update({
              likes: firebase.firestore.FieldValue.arrayUnion(this.currentUser.uid),
            });
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
.tutorial
  .tools
    position fixed
    top 90px
    left 0
    width 60px
    z-index 100
    padding 0 0 10px
    .check-btn
      position fixed
      top 270px
      left 70px
    .tool
      padding 18px 20px
      display block
      margin 0 auto
      font-size 1.2rem
      position relative
      span
        position absolute
        width 100%
        margin 0 auto
        left 0
        top 43px
        font-size .7rem
        line-height .7rem
        font-weight bold
    .isLiked
      color #ff0090
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
