import Vue from 'vue'
import VueRouter from 'vue-router'
import ContactIndex from '../components/ContactIndex.vue'

Vue.use(VueRouter)

const routes = [
    {
      path: '/',
      name: 'ContactIndex',
      component: ContactIndex
    },
  ]
  
  const router = new VueRouter({
    mode: 'history',
    routes
  })
  
  export default router