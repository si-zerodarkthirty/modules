<template>
  <div
    v-if="currentUser && currentUser.uid == tutorial.user"
    class="update-tutorial editor"
  >
    <h1>update tutorial</h1>
    <button
      class="publish-btn"
      @click="publish"
      :class="{viable: tutorial.name}"
    >
      <fa
        icon="upload"
      />
      update tutorial
    </button>
    <label for="name">
      name
    </label>
    <input
      type="text"
      name="name"
      v-model="tutorial.name"
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
          v-model="tutorial.thumbnail"
          class="thumbnail"
        >
      </div>
      <div
        class="thumbnail-box"
        :style="'background-image: url('+tutorial.thumbnail+');'"
      >
        <span v-if="!tutorial.thumbnail">No image is set.</span>
      </div>
    </div>
    <label for="modules">
      modules
    </label>
    <input
      type="text"
      name="module-id"
      v-model="itemId"
      placeholder="new module ID"
      @keypress.enter="setItem"
    >
    <draggable @end="onEnd">
      <SetItem
        v-for="moduleItem in orderBy(tutorial.modules, 'num')"
        :key="moduleItem.id"
        :id="moduleItem.id"
        :num="moduleItem.num"
      />
    </draggable>
    <label for="intro">
      introduction
      <div class="info">Markdownで編集できます。</div>
      <button class="sp" @click="isEdit = !isEdit">
        <span v-if="isEdit">preview</span>
        <span v-else>edit</span>
      </button>
    </label>
    <div class="flex md-editor pc">
      <prism-editor
        :code="tutorial.intro"
        language="html"
        v-model="tutorial.intro"
      ></prism-editor>
      <div
        class="view"
        v-html="md.render(tutorial.intro)"
      ></div>
    </div>
    <div class="md-editor sp">
      <prism-editor
        :code="tutorial.intro"
        language="html"
        v-model="tutorial.intro"
        v-if="isEdit"
      ></prism-editor>
      <div
        class="view"
        v-html="md.render(tutorial.intro)"
        v-else
      ></div>
    </div>
  </div>
</template>

<script>
import { auth, db } from '@/main';
import SetItem from '@/components/SetItem';
import markdownIt from 'markdown-it';
import hljs from 'highlight.js';
import sanitizer from 'markdown-it-sanitizer';
import markdownItAnchor from 'markdown-it-anchor';
import markdownItTocDoneRight from 'markdown-it-toc-done-right';
import katex from '@iktakahiro/markdown-it-katex';
import draggable from 'vuedraggable';
import Vue2Filters from 'vue2-filters';
import PrismEditor from 'vue-prism-editor';

export default {
  components: {
    SetItem,
    draggable,
    PrismEditor,
  },
  head: {
    title: {
      inner: 'tutorialを更新する',
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
      tutorial: {},
      itemId: '',
      isEdit: true,
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
  firestore() {
    return {
      tutorial: db.collection('tutorials').doc(this.$route.params.id),
    };
  },
  methods: {
    publish() {
      if (this.tutorial.name && this.tutorial.modules.length > 1) {
        const date = this.$date(new Date(), 'DD.MMMM.YYYY');
        db.collection('tutorials').doc(this.$route.params.id)
          .set({
            name: this.tutorial.name,
            modules: this.tutorial.modules,
            updatedAt: date,
            thumbnail: this.tutorial.thumbnail,
            intro: this.tutorial.intro,
          }, { merge: true })
          .then(
            this.$router.push(`/tutorial/${this.tutorial.user}/${this.tutorial.id}`),
            this.$toasted.show('tutorialが更新されました。', { duration: 2000 }),
          );
      } else {
        this.$toasted.show('名前と2つ以上のmoduleが登録されているかご確認ください。', { duration: 2000 });
      }
    },
    setItem() {
      const itemsLength = document.getElementsByClassName('set-item').length;
      db.collection('items').doc(this.itemId)
        .get()
        .then((item) => {
          if (item.exists) {
            this.tutorial.modules.push({
              id: this.itemId,
              num: itemsLength + 1,
            });
          } else {
            this.$toasted.show('IDが間違っています。', { duration: 2000 });
          }
        });
    },
    onEnd() {
      const rawItems = document.getElementsByClassName('set-item');
      const items = [].slice.call(rawItems);
      this.tutorial.modules.forEach((moduleItem) => {
        const moduleElement = document.getElementById(`item${moduleItem.num}`);
        moduleItem.num = items.indexOf(moduleElement) + 1;
      });
    },
  },
  mixins: [Vue2Filters.mixin],
};
</script>

<style lang="stylus" scoped>
.set-item
  cursor move
  &:first-child
      border none
</style>
