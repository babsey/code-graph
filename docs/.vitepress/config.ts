import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Code Graph",
  description: "Graph to code in minutes",
  ignoreDeadLinks: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    // nav: [
    //   { text: 'Home', link: '/' },
    //   { text: 'Examples', link: '/markdown-examples' }
    // ],

    sidebar: [
      {
        text: "Introduction",
        items: [
          { text: "What is Code Graph?", link: "/guide/what-is-code-graph" },
          { text: "Get started", link: "/guide/getting-started" },
          { text: "Basic usage", link: "/guide/basic-usage" },
        ],
      },
      {
        text: "Resources",
        items: [{ text: "Credits", link: "/resources/credits" }],
      },
    ],

    socialLinks: [{ icon: "github", link: "https://github.com/babsey/code-graph" }],
  },
});
