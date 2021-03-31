import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/statistique',
    name: 'Statistics',
    component: () => import('../views/Statistic.vue')
  },
  {
    path: '/donnees',
    name: 'Data',
    component: () => import('../views/Data.vue'),
    meta: { perm: 10 }
  },
  {
    path: '/donnees/:id',
    name: 'EditData',
    component: () => import('../views/Data/Edit.vue'),
    meta: { perm: 10 }
  },
  {
    path: '/gestion',
    name: 'Management',
    redirect: '/gestion/variables',
    meta: { perm: 50 }
  },
  {
    path: '/gestion/textes',
    name: 'TextsManagement',
    component: () => import('../views/Management/Texts.vue'),
    meta: { perm: 50 }
  },
  {
    path: '/gestion/utilisateurs',
    name: 'UserManagement',
    component: () => import('../views/Management/Users.vue'),
    meta: { perm: 50 }
  },
  {
    path: '/gestion/variables',
    name: 'DatatypesManagement',
    component: () => import('../views/Management/Datatypes.vue'),
    meta: { perm: 50 }
  },
  {
    path: '/connexion',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { notLogged: true }
  },
  {
    path: '/inscription',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    meta: { notLogged: true }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (typeof to.meta.perm !== 'undefined' && !store.getters.token) {
    return next('/connexion');
  } else if (typeof to.meta.perm !== 'undefined' && store.getters.user.permissions < to.meta.perm
    || to.meta.notLogged && store.getters.token) {
    return next('/');
  } else {
    return next();
  }
})

export default router
