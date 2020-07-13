module.exports = {
  title: "CpMate",
  description: "The bridge between Adobe Captivate and Adobe Animate",
  base: "/cpmate/",
  theme: "default-prefers-color-scheme",
  themeConfig: {
    sidebarDepth: 1,
    defaultTheme: "dark",
    nav: [
      { text: "Home", link: "/" },
      { text: "Getting Started", link: "/getting-started/purpose" },
      {
        text: "Features",
        ariaLabel: "language Menu",
        link: "/features/",
        items: [
          {
            text: "Building Animations",
            link: "/features/building-animations/"
          },
          {
            text: "Javascript API",
            link: "/features/javascript-api/preferences"
          },
          {
            text: "Smart Instance Names",
            link: "/features/smart-instance-names/"
          }
        ]
      },
      { text: "Troubleshooting", link: "/troubleshooting/about" },
      { text: "Training", link: "/training/" },
      { text: "Buy", link: "/buy/" },
      { text: "CpExtra", link: "https://www.widgetking.github.io/cpextra/" }
    ],
    sidebar: {
      "/getting-started/": [
        "purpose",
        "requirements",
        "animate-config",
        "captivate-config",
        "workflow",
        "license",
        "changelog"
      ],
      "/troubleshooting/": [
        "about",
        "animation-playback",
        "slow-playback",
        "interactivity",
        "symbol-name-prefixes"
      ],
      "/features/building-animations/": [
        "/",
        "multiple-animations",
        "captivate-syncing",
        "outer-rendering"
      ],
      "/features/javascript-api/": [
        "preferences",
        "captivate",
        "run-in-captivate-window",
        "sliders"
      ],
      "/features/smart-instance-names/": [
        "/",
        "cp-enhanced-movie-clips",
        "cp-enhanced-text-fields"
      ]
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
