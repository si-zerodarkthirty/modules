<template>
  <div class="module-body">
    <div class="titles">
      <p class="idx">module {{idx}}</p>
      <h2>{{data.title}}</h2>
      <UserData 
        :uid="data.user"
        :date="data.updatedAt"
      />
    </div>
    <div class="body">
      <div 
        class="description view"
        v-html="md.render(data.description)"
      ></div>
      <div 
        class="content view"
        v-html="md.render(data.content)"
      ></div>
    </div>
  </div>
</template>

<script>
import { db } from "@/main"
import UserData from "@/components/UserData"
import markdownIt from 'markdown-it';
import hljs from 'highlight.js';
import sanitizer from 'markdown-it-sanitizer';
import markdownItAnchor from 'markdown-it-anchor';
import markdownItTocDoneRight from 'markdown-it-toc-done-right';
import katex from '@iktakahiro/markdown-it-katex';
export default {
  props: ['data','idx'],
  components: {
    UserData
  },
  data() {
    return {
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
    }
  }
}
</script>

<style lang="stylus" scoped>
.titles
  margin 50px auto
  text-align center
  width 90%
  max-width 600px
  .idx
    background #2c3e50
    color white
    height 30px
    line-height 30px
    padding 0 20px
    border-radius 15px
    width fit-content
    margin 0 auto
    font-weight bold
    font-size 1rem
</style>

