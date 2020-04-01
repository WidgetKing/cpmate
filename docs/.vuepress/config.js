module.exports = {
  title: "CpMate",
  description: "The bridge between Adobe Captivate and Adobe Animate",
  base: "/cpmate/",
  theme: "default-prefers-color-scheme",
  themeConfig: {
    defaultTheme: "dark",
    nav: [
      { text: "Home", link: "/" },
      { text: "Getting Started", link: "/getting-started/" },
      { text: "Features", link: "/features/" },
      { text: "Troubleshooting", link: "/troubleshooting/" },
      { text: "Buy", link: "/buy/" },
      { text: "Video Training", link: "/video-training/" },
      { text: "CpMate", link: "https://www.widgetking.github.io/cpextra/" }
    ],
    sidebar: {
      "/getting-started/": ["/", "installation", "license"],
      "/troubleshooting/": ["/", "Interactivity"],
      "/features/": ["/", "captivate-timeline-sync", "installation", "license"]
    }
  },
  plugins: [
    [
      "@vuepress/search",
      {
        searchMaxSuggestions: 10
      }
    ]
  ],
  postcss: {
    plugins: [
      require("css-prefers-color-scheme/postcss"),
      require("autoprefixer")
    ]
  }
};
