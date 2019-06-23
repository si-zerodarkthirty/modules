import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home';
import Create from './views/Create';
import Module from './views/Module';
import User from './views/User';
import Update from './views/Update';

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
      path: '/user/:uid',
      name: 'user',
      component: User,
    },
  ],
});
