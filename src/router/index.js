import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', name: 'login', component: () => import('../views/LoginView.vue') },
    { path: '/products', name: 'products', component: () => import('../views/ProductListView.vue'), meta: { requiresAuth: true } },
    { path: '/products/new', name: 'add-product', component: () => import('../views/AddProductView.vue'), meta: { requiresAuth: true } },
    { path: '/products/:id', name: 'view-product', component: () => import('../views/ViewProductView.vue'), meta: { requiresAuth: true } },
    { path: '/products/:id/edit', name: 'edit-product', component: () => import('../views/EditProductView.vue'), meta: { requiresAuth: true } },
    { path: '/', redirect: '/login' }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    next('/products')
  } else {
    next()
  }
})

export default router
