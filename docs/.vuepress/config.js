module.exports = {
  title: "CpMate",
  description: "The bridge between Adobe Captivate and Adobe Animate",
  base: "/cpmate/",
  theme: "default-prefers-color-scheme",
  themeConfig: {
    defaultTheme: "dark",
    nav: [
      { text: "Home", link: "/" },
      { text: "Guide", link: "/guide/" },
      { text: "Javascript API", link: "/javascript-api/" },
      { text: "Buy", link: "/buy/" }
    ],
    sidebar: {
      "/guide/": ["", "installation"]
    }
  },
  postcss: {
    plugins: [
      require("css-prefers-color-scheme/postcss"),
      require("autoprefixer")
    ]
  }
};
