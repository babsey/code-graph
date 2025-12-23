// router

import { createRouter, createWebHistory } from "vue-router";

import { hasEditorState, loadEditor, newEditor } from "@/helpers/editor";

const router = createRouter({
  // history: createWebHashHistory(import.meta.env.BASE_URL),
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../views/HomeView.vue"),
    },
    {
      path: "/about",
      name: "about",
      component: () => import("../views/AboutView.vue"),
    },
    {
      path: "/new",
      name: "new",
      component: () => import("../views/CodeGraphView.vue"),
    },

    {
      path: "/edit/:editorId",
      name: "edit",
      component: () => import("../views/CodeGraphView.vue"),
      props: true,
    },
  ],
});

router.beforeEach((to) => {
  if (!["new", "edit"].includes(to.name as string)) return true;

  switch (to.name) {
    case "new":
      return newEditor();
    case "edit":
      if (hasEditorState(to.params?.editorId as string)) return loadEditor(to.params?.editorId as string);
      return newEditor();
  }

  return true;
});

export default router;
