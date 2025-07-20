import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import AddUpdatePage from '@/views/AddUpdatePage.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/add-update', component: AddUpdatePage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
