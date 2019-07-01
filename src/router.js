import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home';
import Create from './views/Create';
import Module from './views/Module';
import User from './views/User';
import Update from './views/Update';
import Tutorial from './views/Tutorial';
import UpdateTutorial from './views/UpdateTutorial';
import Tag from './views/Tag';

Vue.use(Router);

export default new Router({
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/create',
      name: 'create',
      component: Create,
    },
    {
      path: '/update/:id',
      name: 'update',
      component: Update,
    },
    {
      path: '/module/:uid/:id',
      name: 'module',
      component: Module,
    },
    {
      path: '/tutorial/:uid/:id',
      name: 'tutorial',
      component: Tutorial,
    },
    {
      path: '/update-tutorial/:uid/:id',
      name: 'update-tutorial',
      component: UpdateTutorial,
    },
    {
      path: '/user/:uid',
      name: 'user',
      component: User,
    },
    {
      path: '/tag/:tag',
      name: 'tag',
      component: Tag,
    },
  ],
});
