<template>
  <div class="module">
    <div class="tools">
      <button
        class="tool"
        @click="toggleLike"
        :class="{isLiked: isLiked}"
      >
        <fa
          icon="heart"
        />
        <span>{{ skill.likes.length }}</span>
      </button>
      <a :href="'https://twitter.com/intent/tweet?text=「'+skill.title+'」'+'-%20modulesで学ぶ&url=https://modules.tech/module/'+skill.user+'/'+skill.id" target="_blank">
        <button class="tool tweet">
          <fa
            :icon="['fab', 'twitter']"
          />
          <span>tweet</span>
        </button>
      </a>
      <button
        class="tool"
        @click="$clipboard('https://modules.tech/module/'+skill.user+'/'+skill.id),$toasted.show('URLをコピーしました。', { duration: 2000 })"
      >
        <fa
          icon="link"
        />
        <span>URL</span>
      </button>
    </div>
    <div
      class="thumbnail"
      :style="'background-image: url('+skill.thumbnail+');'"
    >
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
          <router-link :to="'/update/'+skill.id">
            <p>編集する</p>
          </router-link>
          <p @click="deleteItem">削除する</p>
        </div>
        <h1>{{ skill.title }}</h1>
        <Keywords
          :keywords="skill.keywords"
        />
        <UserData
          :uid="$route.params.uid"
          :createdAt="skill.createdAt"
        />
        <div class="id">
          module ID: {{ skill.id }}
          <div
            class="copy-btn"
            @click="$clipboard(skill.id),$toasted.show('IDをコピーしました。', { duration: 2000 })"
          >
            <fa
              icon="copy"
            />
            copy ID
          </div>
        </div>
      </div>
    </div>
    <div class="body">
      <div class="dependencies">
        <nav>
          <button
            @click="prevIsVisible = true"
            :class="{active: prevIsVisible}"
            >previous
          </button>
          <button
            @click="prevIsVisible = false"
            :class="{active: !prevIsVisible}"
            >nexts
          </button>
        </nav>
        <div v-if="prevIsVisible"
             class="mini-list">
          <MiniItem
            v-if="skill.dependency"
            :id="skill.dependency"
          />
          <p v-else>
            これは最初のモジュールです。
          </p>
        </div>
        <div v-else
             class="mini-list">
          <div v-if="dependents && dependents.length > 0">
            <MiniItem
              v-for="item in dependents"
              :key="item.id"
              :id="item.id"
            />
          </div>
          <p v-else>
            これに続くモジュールはまだありません。
          </p>
        </div>
      </div>
      <div
        class="description"
        v-html="md.render(skill.description)"
      >
      </div>
      <div
        class="content"
        v-html="md.render(skill.content)"
      ></div>
      <div v-if="dependents && dependents.length > 0" class="next">
        <h3>next modules</h3>
        <div class="mini-list">
          <MiniItem
            v-for="item in dependents"
            :key="item.id"
            :id="item.id"
          />
        </div>
      </div>
      <vue-disqus
        shortname="modules-1"
        :identifier="skill.id"
        :url="'https://modules.com/'+skill.user+'/'+skill.id"
      ></vue-disqus>
    </div>
  </div>
</template>

<script>
import { db, auth } from '@/main';
import firebase from 'firebase';
import UserData from '@/components/UserData';
import Keywords from '@/components/Keywords';
import MiniItem from '@/components/MiniItem';
import markdownIt from 'markdown-it';
import hljs from 'highlight.js';
import sanitizer from 'markdown-it-sanitizer';
import markdownItAnchor from 'markdown-it-anchor';
import markdownItTocDoneRight from 'markdown-it-toc-done-right';
import katex from '@iktakahiro/markdown-it-katex';

export default {
  components: {
    UserData,
    Keywords,
    MiniItem,
  },
  data() {
    return {
      isVisible: false,
      isLiked: false,
      skill: {},
      currentUser: {},
      dependents: {},
      prevIsVisible: true,
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
  firestore() {
    return {
      skill: db.collection('items').doc(this.$route.params.id),
      dependents: db.collection('items').where('dependency', '==', this.$route.params.id),
    };
  },
  created() {
    auth.onAuthStateChanged((user) => {
      this.currentUser = user;
      db.collection('items')
        .doc(this.$route.params.id)
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
    deleteItem() {
      if (window.confirm(`「${this.skill.title}」を削除します。よろしいですか？`)) {
        db.collection('items').doc(this.$route.params.id)
          .delete()
          .then(
            this.$router.push(`/user/${this.skill.user}`),
          );
      }
    },
    toggleLike() {
      if (this.currentUser) {
        if (this.isLiked) {
          db.collection('items')
            .doc(this.$route.params.id)
            .update({
              likes: firebase.firestore.FieldValue.arrayRemove(this.currentUser.uid),
            });
        } else {
          db.collection('items')
            .doc(this.$route.params.id)
            .update({
              likes: firebase.firestore.FieldValue.arrayUnion(this.currentUser.uid),
            });
        }
      } else {
        this.$toasted.show('moduleにlikeするにはサインインが必要です。', { duration: 2000 });
      }
    }
  },
};
</script>

<style lang="stylus" scoped>
.tools
  position fixed
  top 70px
  left 0
  width 60px
  background white
  box-shadow 0 0 10px rgba(0,0,0,.2)
  border-top-right-radius 5px
  border-bottom-right-radius 5px
  z-index 10
  padding 0 0 10px
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
      bottom 5px
      font-size .8rem
      font-weight bold
  .isLiked
    color #ff0090
.thumbnail
  width 104%
  margin-left -2%
  height 400px
  margin-top -100px
  text-align justify
  background-size cover
  background-position center
  position relative
  .id
    background #2c3e50
    font-size .9rem
    color white
    padding 0 10px
    font-weight bold
    margin-top 15px
    display flex
    flex-wrap nowrap
    justify-content space-between
    line-height 45px
    height 45px
    .copy-btn
      font-size .8rem
      background white
      color #2c3e50
      padding 5px
      border-radius 3px
      line-height 20px
      height 20px
      margin-top 8px
      box-shadow 0 0 10px rgba(0,0,0,.5)
      cursor pointer
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
    top 45px
    right 10px
    background white
    box-shadow 0 0 10px #eee
    border-radius 5px
    p
      margin 0
      font-size .7rem
      padding 5px 15px
      cursor pointer
      &:hover
        background #eee
      &:first-child
        border-bottom 1px solid #eee
  .texts
    position absolute
    top 120px
    left 50%
    width 400px
    margin-left -200px
    border-radius 5px
    padding 10px 0 0
    background white
    box-shadow 0 0 10px rgba(0,0,0,.2)
    overflow hidden
    h1
      font-size 1rem
      margin 10px 20px
    .user
      margin 20px 0 0 15px
nav
  button
    border 3px solid #2c3e50
    padding 0 10px
    border-radius 18px
    height 36px
    line-height 30px
    margin-right 5px
    font-weight bold
  .active
    background #2c3e50
    color white
.mini-list
  box-shadow 0 0 10px rgba(0,0,0,.1)
  border-radius 5px
  margin 10px 0
  font-weight bold
  p
    padding 5px 10px
.body
  max-width 500px
  width 95%
  margin 50px auto
  font-size 1rem
  line-height 1.8rem
  .description
    border 5px solid #2c3e50
    padding 3px 18px
    font-size .9rem
    font-weight bold
    margin-bottom 50px
  .content
    padding-bottom 50px
  .next
    border-top 1px solid #eee
    border-bottom 1px solid #eee
    padding-bottom 50px
    margin-bottom 50px
    h3
      text-align center
      font-size 1.5rem
</style>
