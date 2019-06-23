<template>
  <div class="editor">
    <h1>edit this module</h1>
    <button
      class="publish-btn"
      @click="update"
      :class="{viable: skill.title && skill.description && skill.keywords && skill.content}"
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
      step="50"
      v-model="skill.price"
      class="price"
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
      v-model="skill.title"
    >
    <div class="flex">
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
          v-model="skill.thumbnail"
          class="thumbnail"
        >
      </div>
      <div
        class="thumbnail-box"
        :style="'background-image: url('+skill.thumbnail+');'"
      >
        <span v-if="!skill.thumbnail">No image is set.</span>
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
      dependency
      <div class="info">別のmoduleの内容を前提にしたい場合は、そのmoduleのIDを登録してください。</div>
    </label>
    <input
      type="text"
      name="dependency"
      class="dependency"
      v-model="skill.dependency"
      placeholder="Module ID"
      @keypress.enter="updateDependency"
    >
    <div v-if="skill.dependency" class="result flex">
      <div 
        class="result-thumbnail"
        :style="'background-image: url('+gotItem.thumbnail+');'"
      ></div>
      <p class="result-title">{{ gotItem.title }}</p>
    </div>
    <label for="description">
      module description
      <div class="info">目標, ターゲット, 前提知識を記入してください。</div>
    </label>
    <div class="flex content">
      <textarea
        type="text"
        name="description"
        class="description"
        v-model="skill.description"
      ></textarea>
      <div
        class="view"
        v-html="md.render(skill.description)"
      ></div>
    </div>
    <label for="content">
      module content
      <div class="info">Markdownで編集できます。</div>
    </label>
    <div class="flex content">
      <textarea
        type="text"
        name="content"
        v-model="skill.content"
      ></textarea>
      <div
        class="view"
        v-html="md.render(skill.content)"
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
  data () {
    return {
      skill: {},
      gotItem: {},
      gotItemId: "",
      keyword: "",
      keywords: [],
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
        .use(katex, { throwOnError: false, errorColor: ' #cc0000' })
    }
  },
  firestore () {
    return {
      skill: db.collection("items").doc(this.$route.params.id)
    }
  },
  created () {
    db.collection("items").doc(this.$route.params.id)
    .get()
    .then(item => {
      this.keywords = item.data().keywords
      if (item.data().dependency) {
        db.collection("items").doc(item.data().dependency)
        .get()
        .then(item => {
          this.gotItem = item.data()
        })
      }
    })
  },
  methods: {
    getItem () {
      db.collection("items").doc(this.skill.dependency)
      .onSnapshot(item => {
        this.gotItem = item.data()
        this.skill.dependency = item.id
      })
    },
    addKeyword () {
      this.keywords.push(this.keyword)
        .then(
          this.keyword = '',
        );
    },
    deleteKeyword(i) {
      this.keywords.splice(i, 1);
    },
    update () {
      if (this.skill.title && this.skill.description && this.skill.keywords && this.skill.content) {
        const date = this.$date(new Date(), 'DD.MMMM.YYYY');
        db.collection('items').doc(this.$route.params.id).set({
          price: this.skill.price,
          title: this.skill.title,
          thumbnail: this.skill.thumbnail,
          description: this.skill.description,
          content: this.skill.content,
          upadatedAt: date,
          keywords: this.keywords
        }, {merge: true})
        .then(
          this.$toasted.show('moduleが更新されました！', { duration: 2000 }),
          this.$router.push('/module/'+this.skill.user+'/'+this.skill.id)
        );
      } else {
        this.$toasted.show('必要な情報を記入してください。', { duration: 2000 });
      }
    },
    updateDependency () {
      db.collection('items').doc(this.$route.params.id).set({
        dependency: this.skill.dependency
      }, {merge: true})
      .then(
        this.$toasted.show('moduleが更新されました！', { duration: 2000 })
      );
    }
  }
}
</script>
