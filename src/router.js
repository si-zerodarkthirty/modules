import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home';
import Editor from './views/Editor';
import Skill from './views/Skill';
import User from './views/User';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/editor',
      name: 'editor',
      component: Editor,
    },
    {
      path: '/skill/:id',
      name: 'skill',
      component: Skill,
    },
    {
      path: '/user/:uid',
      name: 'user',
      component: User,
    },
  ],
});
