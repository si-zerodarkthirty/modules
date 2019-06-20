<template>
  <div class="editor">
    <h1>New Skill</h1>
    <button 
      class="publish-btn"
      @click="publish"
      :class="{viable: price && title && intro && keywords && content}"
    >
      Publish Skill
    </button>
    <label for="price">価格 (円)</label>
    <input 
      type="text" 
      name="price"
      v-model="price"
      class="price"
    >
    <label for="title">タイトル：キャッチーなフレーズでユーザーの目を惹きましょう。</label>
    <input 
      type="text" 
      name="title"
      v-model="title"
    >
    <div class="flex">
      <div>
        <label for="thumbnail">画像URL</label>
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
    <label for="intro">Skill Itemの紹介：目標, ターゲット, 前提知識などを教えてください。</label>
    <textarea 
      type="text" 
      name="intro"
      class="intro"
      v-model="intro"
    ></textarea>
    <label for="keywords">Keyword(s)</label>
    <input 
      type="text" 
      name="keywords"
      class="keywords"
      v-model="keyword"
      @keypress.enter="addKeyword"
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
    <label for="prev">依存するSkill Item：別のSkill Itemに依存している場合は、依存元のItemを登録してください。</label>
    <input 
      type="text" 
      name="prev"
      class="prev"
      v-model="query"
      @keypress.enter="getItems"
      placeholder="依存元のSkill Item ID"
    >
    <div class="flex">
      <label for="content">Skill Lecture：Markdownで編集できます。</label>
    </div>
    <div class="flex content">
      <textarea
        type="text" 
        name="content"
        v-model="content"
      ></textarea>
      <div 
        class="view" 
        v-html="md.render(content)"
        :class="{visible:isVisible}"
      ></div>
    </div>
  </div>
</template>

<script>
import { db, auth } from "@/main"
import markdownIt from "markdown-it";
import hljs from "highlight.js";
import sanitizer from "markdown-it-sanitizer";
import markdownItAnchor from "markdown-it-anchor";
import markdownItTocDoneRight from "markdown-it-toc-done-right";
import katex from "@iktakahiro/markdown-it-katex";
export default {
  data () {
    return {
      currentUser: {},
      query: "",
      price: 0,
      title: "",
      thumbnail: "",
      intro: "",
      keywords: [],
      previous: "",
      content: "",
      keyword: "",
      md: new markdownIt({
        highlight: function(code, lang) {
            return hljs.highlightAuto(code, [lang]).value;
        },
        html: true,
        linkify: true,
        breaks: true,
        xhtmlOut: true,
        typographer: true
      })
      .use(sanitizer)
      .use(markdownItAnchor, {
        permalink: true, 
        permalinkBefore: true, 
        permalinkSymbol: '§' 
      })
      .use(markdownItTocDoneRight)
      .use(katex, { throwOnError: false, errorColor: " #cc0000" })
    }
  },
  created () {
    auth.onAuthStateChanged(user => {
      this.currentUser = user
    })
  },
  methods: {
    addKeyword () {
      this.keywords.push(this.keyword)
      .then(
        this.keyword = ""
      )
    },
    deleteKeyword (i) {
      this.keywords.splice(i,1)
    },
    publish () {
      if (this.price && this.title && this.intro && this.keywords && this.content) {
        const date = this.$date(new Date(), "DD.MMMM.YYYY")
        db.collection("items").add({
          price: this.price,
          title: this.title,
          thumbnail: this.thumbnail,
          createdAt: date,
          intro: this.intro,
          keywords: this.keywords,
          previous: this.previous,
          content: this.content,
          user: this.currentUser.uid
        })
        .then(
          this.$toasted.show('Skill Itemが公開されました！', { duration: 2000 })
        )
      } else {
        this.$toasted.show('必要な情報を記入してください。', { duration: 2000 })
      }
    }
  }
}
</script>


<style lang="stylus" scoped>
label
  display block
  font-size 1rem
  margin 30px 0 0
input, textarea
  display block
  border none
  margin 10px 0
  padding 0 2%
  width 96%
  font-size 1rem
input
  height 45px
  line-height 45px
  border-radius 5px
  background #eee
.price, .keywords, .prev
  width 200px
.intro
  height 50px
  border-radius 5px
  background #eee
  resize none
  padding 15px 2%
.thumbnail
  width 250px
.content
  height 400px
  width 104%
  margin-left -2%
  border-top 3px solid #eee
  border-bottom 3px solid #eee
  textarea
    resize none
    background #eee
    width 48%
    margin 0
    padding 15px
  .view
    padding 0 15px
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
.thumbnail-box
  width 200px
  height 120px
  background-size cover
  box-shadow 0 0 5px #eee
  margin-left 20px
  border-radius 5px
  text-align center
  line-height 120px
.publish-btn
  position fixed
  top 20px
  left 50%
  width 150px
  margin-left -75px
  z-index 1000
  border 1px solid rgba(0,0,0,.3)
  color rgba(0,0,0,.3)
  padding 10px 20px
  border-radius 20px
.viable
  background black
  color white
  border 1px solid black
</style>
