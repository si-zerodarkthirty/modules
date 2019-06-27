<template>
  <div class="tutorial">
    <h1>{{tutorial.name}}</h1>
    <UserData
      :uid="$route.params.uid"
      :date="tutorial.createdAt"
    />
    {{activeId}}
    <nav class="page-nav">
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
      intro
    </div>
    <ModuleBody 
      v-else
      :data="activeModule"
      :idx="activeIdx"
    />
  </div>
</template>

<script>
import { db } from '@/main';
import UserData from '@/components/UserData';
import ModuleBody from '@/components/ModuleBody';

export default {
  components: {
    UserData,
    ModuleBody
  },
  data() {
    return {
      tutorial: {},
      activeIdx: 0,
      activeModule: {}
    };
  },
  firestore() {
    return {
      tutorial: db.collection("tutorials").doc(this.$route.params.id)
    };
  },
  methods: {
    getModule(id) {
      db.collection("items").doc(id)
      .get()
      .then(item => {
        this.activeModule = item.data()
      })
    }
  }
};
</script>

<style lang="stylus" scoped>
.tutorial
  h1
    font-size 1.5rem
</style>
