import { createRouter, createWebHistory } from 'vue-router';

import { useCodeGraphStore } from '@/stores/codeGraphStore';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/new/:codeName',
      name: 'new',
      component: () => import('../views/CodeGraphView.vue'),
      props: true,
    },
    {
      path: '/edit/:editorId',
      name: 'edit',
      component: () => import('../views/CodeGraphView.vue'),
      props: true,
    },
  ],
});

router.beforeEach((to) => {
  // console.log('before router', to.name)

  if (!['new', 'edit'].includes(to.name)) return true;

  const codeGraphStore = useCodeGraphStore();

  switch (to.name) {
    case 'new':
      return codeGraphStore.newEditor(to.params.codeName as string);
    case 'edit':
      return codeGraphStore.loadEditor(to.params.editorId as string);
  }

  return true;
});

export default router;
