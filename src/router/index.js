import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from "../components/Login/Login";
import store from '@/store'

const routes = [
  {
    path: '/',
    component: Home,
    name: 'Home'
  },
  {
    path: '/login',
    component: Login,
    name: 'Login',
    // redirect: to => {
    //
    // }
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {

    if (!store.state.isAuth && !localStorage.getItem('userData') && to.name !== 'Login') {
      console.log('not Auth')
      next('/login')
    }else {
      console.log('auth')
      next()
    }
})

export default router
