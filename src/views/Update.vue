<template>
  <div
    v-if="currentUser && currentUser.uid === skill.user"
    class="editor"
  >
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
      min="0"
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
      <div class="info">入力してEnterキーを押すとキーワードが追加されます。</div>
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
    <label for="previous">
      previous module
      <div class="info">別のmoduleの内容を前提にしたい場合は、そのmoduleのIDを登録してください。</div>
    </label>
    <input
      type="text"
      name="previous"
      class="dependency"
      v-model="previous"
      placeholder="Module ID"
      @keypress.enter="addPrevious"
    >
    <div 
      v-if="previouses.length > 0" 
      class="flex"
    >
      <p 
        v-for="(previous,idx) in previouses"
        :key="idx"
        class="result"
      >
        {{ previous }}
        <span @click="deletePrevious(idx)">
          X
        </span>
      </p>
    </div>
    <label for="description">
      module description
      <div class="info">目標、ターゲット、前提知識を記入してください。</div>
      <button class="sp" @click="isEdit = !isEdit">
        <span v-if="isEdit">preview</span>
        <span v-else>edit</span>
      </button>
    </label>
    <div class="flex md-editor pc">
      <textarea
        v-model="skill.description"
      ></textarea>
      <div
        class="view"
        v-html="md.render(skill.description)"
      ></div>
    </div>
    <div class="md-editor sp">
      <textarea
        v-model="skill.description"
        v-if="isEdit"
      ></textarea>
      <div
        class="view"
        v-html="md.render(skill.description)"
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
        v-model="skill.content"
      ></textarea>
      <div
        class="view"
        v-html="md.render(skill.content)"
      ></div>
    </div>
    <div class="md-editor sp">
      <textarea
        v-model="skill.content"
        v-if="isEdit"
      ></textarea>
      <div
        class="view"
        v-html="md.render(skill.content)"
        v-else
      ></div>
    </div>
  </div>
  <div v-else>
    Invalid User.
  </div>
</template>

<script>
import { auth, db } from '@/main';
import markdownIt from 'markdown-it';
import hljs from 'highlight.js';
import sanitizer from 'markdown-it-sanitizer';
import markdownItAnchor from 'markdown-it-anchor';
import markdownItTocDoneRight from 'markdown-it-toc-done-right';
import katex from '@iktakahiro/markdown-it-katex';

export default {
  head: {
    title: {
      inner: 'moduleを更新する',
      separator: '|',
      complement: 'modules - あなた専用のチュートリアルで学ぼう。',
    },
    meta: [
      { name: 'description', content: 'modulesは全く新しいプログラミング学習サイトです。modulesでは、１機能・１トピック単位でチュートリアルを売買できます。' },
    ],
  },
  data() {
    return {
      currentUser: {},
      isEdit: true,
      skill: {},
      previous: '',
      previouses: [],
      keyword: '',
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
        .use(katex, { throwOnError: false, errorColor: ' #cc0000' }),
    };
  },
  firestore() {
    return {
      skill: db.collection('items').doc(this.$route.params.id),
    };
  },
  created() {
    auth.onAuthStateChanged((user) => {
      this.currentUser = user;
    });
    db.collection('items').doc(this.$route.params.id)
      .get()
      .then((item) => {
        this.keywords = item.data().keywords
        this.previouses = item.data().previouses
      });
  },
  methods: {
    addPrevious() {
      this.previouses.push(this.previous)
        .then(
          this.previous = '',
        );
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
    deletePrevious(i) {
      this.previouses.splice(i, 1);
    },
    save() {
      db.collection('items').doc(this.$route.params.id).set({
        description: this.skill.description,
        content: this.skill.content,
      }, { merge: true })
        .then(
          this.$toasted.show('変更を保存しました！', { duration: 1000 }),
        );
    },
    update() {
      if (this.skill.title && this.skill.description && this.skill.keywords && this.skill.content) {
        const date = this.$date(new Date(), 'DD.MMMM.YYYY');
        db.collection('items').doc(this.$route.params.id).set({
          price: this.skill.price,
          title: this.skill.title,
          thumbnail: this.skill.thumbnail,
          description: this.skill.description,
          content: this.skill.content,
          updatedAt: date,
          keywords: this.keywords,
          previouses: this.previouses
        }, { merge: true })
          .then(
            this.$toasted.show('moduleが更新されました！', { duration: 2000 })
          );
      } else {
        this.$toasted.show('必要な情報を記入してください。', { duration: 2000 });
      }
    }
  },
};
</script>
