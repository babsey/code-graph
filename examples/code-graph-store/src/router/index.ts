import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

import { useCodeGraphStore } from '@/stores/codeGraphStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/edit',
      name: 'new',
      component: () => import('../views/CodeGraphView.vue'),
    },

    {
      path: '/edit/:editorId',
      name: 'edit',
      component: () => import('../views/CodeGraphView.vue'),
      props: true,
    },
  ],
})

router.beforeEach((to) => {
  // console.log(to.name, to.params.editorId)

  const codeGraphStore = useCodeGraphStore()

  switch (to.name) {
    case 'new':
      return codeGraphStore.newEditor()
    case 'edit':
      return codeGraphStore.loadEditor(to.params?.editorId as string)
  }

  return true
})

export default router
