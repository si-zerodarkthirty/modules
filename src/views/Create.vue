<template>
  <div class="editor">
    <h1>create a new module</h1>
    <button
      class="publish-btn"
      @click="publish"
      :class="{viable: title && description && keywords && content}"
    >
      <fa
        icon="upload"
      />
      upload this module
    </button>
    <label for="price">
      price
      <div class="info">
        円単位で入力してください。入力がない場合は、無料で公開されます。
      </div>
    </label>
    <input
      type="number"
      name="price"
      v-model="price"
      class="price"
      step="50"
      min="0"
      max="1000"
    >
    <label for="title">
      title
      <div class="info">
        catchyなタイトルでユーザーの目を惹きましょう。
      </div>
    </label>
    <input
      type="text"
      name="title"
      v-model="title"
    >
    <div class="flex image-input">
      <div>
        <label for="thumbnail">
          image URL
          <div class="info">
            Gyazoやimgbbなどを使って画像のURLを取得してください。
          </div>
        </label>
        <input
          type="text"
          name="thumbnail"
          v-model="thumbnail"
          class="thumbnail"
        >
      </div>
      <div
        class="thumbnail-box"
        :style="'background-image: url('+thumbnail+');'"
      >
        <span v-if="!thumbnail">No image is set.</span>
      </div>
    </div>
    <label for="keywords">
      keyword(s)
      <div class="info">入力してエンターキーを押すとキーワードが追加されます。</div>
    </label>
    <input
      type="text"
      name="keywords"
      class="keywords"
      v-model="keyword"
      @keypress.enter="addKeyword"
      placeholder="new keyword"
    >
    <ul class="kw-box">
      <li
        v-for="(keyword,idx) in keywords"
        :key="idx"
      >
        {{keyword}}
        <fa
          icon="times"
          @click="deleteKeyword(idx)"
        />
      </li>
    </ul>
    <label for="dependency">
      previous module
      <div class="info">別のmoduleの内容を前提にしたい場合は、そのmoduleのIDを登録してください。</div>
    </label>
    <input
      type="text"
      name="dependency"
      class="dependency"
      v-model="inputId"
      placeholder="module ID"
      @keypress.enter="getItem"
    >
    <div v-if="inputId" class="result flex">
      <div
        v-if="gotItemId"
        class="result-thumbnail"
        :style="'background-image: url('+gotItem.thumbnail+');'"
      ></div>
      <p class="result-title">{{ gotItem.title }}</p>
    </div>
    <label for="description">
      module description
      <div class="info">Markdownで編集できます。</div>
      <button class="sp" @click="isEdit = !isEdit">
        <span v-if="isEdit">preview</span>
        <span v-else>edit</span>
      </button>
    </label>
    <div class="flex md-editor pc">
      <textarea
        type="text"
        name="description"
        v-model="description"
      ></textarea>
      <div
        class="view"
        v-html="md.render(description)"
      ></div>
    </div>
    <div class="md-editor sp">
      <textarea
        type="text"
        name="description"
        v-model="description"
        v-if="isEdit"
      ></textarea>
      <div
        class="view"
        v-html="md.render(description)"
        v-else
      ></div>
    </div>
    <label for="content">
      module content
      <div class="info">Markdownで編集できます。</div>
      <button class="sp" @click="isEdit = !isEdit">
        <span v-if="isEdit">preview</span>
        <span v-else>edit</span>
      </button>
    </label>
    <div class="flex md-editor pc">
      <textarea
        type="text"
        name="content"
        v-model="content"
      ></textarea>
      <div
        class="view"
        v-html="md.render(content)"
      ></div>
    </div>
    <div class="md-editor sp">
      <textarea
        type="text"
        name="content"
        v-model="content"
        v-if="isEdit"
      ></textarea>
      <div
        class="view"
        v-html="md.render(content)"
        v-else
      ></div>
    </div>
  </div>
</template>

<script>
import { db, auth } from '@/main';
import markdownIt from 'markdown-it';
import hljs from 'highlight.js';
import sanitizer from 'markdown-it-sanitizer';
import markdownItAnchor from 'markdown-it-anchor';
import markdownItTocDoneRight from 'markdown-it-toc-done-right';
import katex from '@iktakahiro/markdown-it-katex';

export default {
  data() {
    return {
      isEdit: true,
      currentUser: {},
      inputId: '',
      gotItem: {},
      gotItemId: '',
      price: 0,
      title: '',
      thumbnail: '',
      description: '### このモジュールの目標\n\nこのモジュールの目標は、ブラウザにHelloWorldページを表示させ、簡単なデザインを加えることです。このモジュールをクリアすることで、HTML, CSSの基礎を習得できます。\n\n### 前提知識\n\n- HTML, CSSの概要について知っていること。\n\n### 完成イメージ\n\n![helloworld_page](https://i.ibb.co/TwMPHNN/download.png)',
      keywords: [],
      content: '### 見出しはh3（#３つ）から始めてください。',
      keyword: '',
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
  methods: {
    getItem() {
      db.collection('items').doc(this.inputId)
        .onSnapshot((item) => {
          this.gotItem = item.data();
          this.gotItemId = item.id;
        });
    },
    addKeyword() {
      this.keywords.push(this.keyword)
        .then(
          this.keyword = '',
        );
    },
    deleteKeyword(i) {
      this.keywords.splice(i, 1);
    },
    publish() {
      if (this.title && this.description && this.keywords && this.content) {
        const date = this.$date(new Date(), 'DD.MMMM.YYYY');
        db.collection('items').add({
          price: this.price,
          title: this.title,
          thumbnail: this.thumbnail,
          createdAt: date,
          updatedAt: date,
          description: this.description,
          keywords: this.keywords,
          content: this.content,
        })
          .then((data) => {
            this.$toasted.show('moduleが公開されました！', { duration: 2000 }),
            this.$router.push(`/module/${this.currentUser.uid}/${data.id}`);
          });
      } else {
        this.$toasted.show('必要な情報を記入してください。', { duration: 2000 });
      }
    },
  },
};
</script>

<style lang="stylus">
.editor
  label
    display block
    font-size 1rem
    font-weight bold
    margin 30px 0 10px
    position relative
    cursor pointer
    button
      background #2c3e50
      color white
      padding 5px 10px
      border-radius 5px
    .info
      position absolute
      top 25px
      left 0
      width 250px
      box-shadow 0 0 10px rgba(0,0,0,.1)
      border-radius 5px
      background white
      font-size .8rem
      padding 10px
      display none
      transition all .2s
    &:hover
      .info
        display block
  .price, .keywords, .dependency
    width 200px
  .thumbnail
    width 250px
  .image-input
    flex-wrap wrap
  .add-btn
    margin 10px 0 0 0
    padding 5px 10px
    border 4px solid #eee
    border-radius 10px
    font-size 1.5rem
  .kw-box
    padding 0
    li
      display inline-block
      margin 3px 3px 3px 0
      list-style none
      border 1px solid #555
      padding 0 10px
      height 30px
      line-height 30px
      border-radius 15px
      width fit-content
      font-size .9rem
      cursor pointer
  .thumbnail-box
    width 200px
    height 120px
    background-size cover
    box-shadow 0 0 5px #eee
    margin 20px
    border-radius 5px
    text-align center
    line-height 120px
  .result
    box-shadow 0 0 10px rgba(0,0,0,.1)
    border-radius 5px
    width fit-content
    font-size .9rem
    overflow hidden
    .result-title
      line-height 50px
      margin 0 10px
    .result-thumbnail
      width 50px
      height 50px
      background-size cover
      background-position center
  .publish-btn
    position fixed
    bottom 20px
    left 50%
    width 200px
    margin-left -100px
    z-index 1000
    border 1px solid rgba(0,0,0,.3)
    color rgba(0,0,0,.3)
    padding 10px 20px
    border-radius 20px
  .viable
    background black
    color white
    border 1px solid black
    font-weight bold
    box-shadow 0 0 10px rgba(0,0,0,.1)
</style>
