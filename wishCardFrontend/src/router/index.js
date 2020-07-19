import Vue from 'vue'
import Router from 'vue-router'
import guestHome from '@/components/guestHome'
import userHome from '@/components/userHome'
import login from '@/components/login'
import register from '@/components/register'
import wishView from '@/components/wishView'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: login,
      beforeEnter: (to, from, next) => {
        next({ path: '/login' });
      }
    }, {
      path: '/login',
      name: 'Login',
      component: login
    }, {
      path: '/register',
      name: 'Register',
      component: register
    }, {
      path: '/guestHome/:id',
      name: 'GuestHome',
      component: guestHome
    }, {
      path: '/userHome/:id',
      name: 'UserHome',
      component: userHome
    }, {
      path: '/wishView/:id',
      name: 'WishView',
      component: wishView
    }
  ]
})
