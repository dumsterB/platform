const langs = [{
  code: 'en',
  name: 'English',
}, {
  code: "ru",
  name: 'Русский'
}, {
  code: "pl",
  name: 'Polskie'
}, {
  code: "de",
  name: "Deutsch"
}];
import de from "./config/locales/de.js";
import en from "./config/locales/en.js";
import pl from "./config/locales/pl.js";
import ru from "./config/locales/ru.js";
import config from "./config/config.json";

let locales = { en, de, ru, pl };

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  server: {
    port: 3061,
    host: "0.0.0.0",
  },
  ssr: false,
  head: {
    title: config.title,
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
      { name: "format-detection", content: "telephone=no" },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: config.icon }],
  },
  auth: {
    strategies: {
      local: {
        endpoints: {
          login: {
            url: "/api/loginPlatform",
            method: "post",
            propertyName: "token",
          },
          logout: { url: "/api/logout", method: "post" },
          user: {
            url: "/api/platform/user_platform/current",
            method: "get",
            propertyName: "data",
          },
        },
        tokenRequired: true,
        tokenType: 'Bearer'
      },
    },
    redirect: {
      login: "/auth/login",
      logout: "/auth/login",
      callback: "/auth/login",
      home: "/account",
    },
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ["balm-ui/dist/balm-ui.css", "~layouts/global.css"],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ["~/plugins/axios", "~/plugins/envstore", "@/plugins/balm-ui"],

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    "@nuxtjs/vuetify",
    [
      "@nuxtjs/dotenv",
      {
        // ..
      },
    ],
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: ["@nuxtjs/axios", "@nuxtjs/auth", "@nuxtjs/i18n"],

  router: {
    middleware: ['auth']
  },

  vuetify: {
    customVariables: ["~/assets/scss/app.scss"],
    theme: {
      themes: {
        dark: {
          primary: "#2fed59",
          info: "#ffffff66",
          secondary: "#ffffffa6",
          accent: "#d1d4dc",
          error: "#ff2b5e",
          success: "#32fa5d",
          warning: "#ff922e",
        },
        light: {
          primary: "#166e29",
          info: "#00000066",
          secondary: "#000000a6",
          accent: "#293345",
          error: "#ff2b5e",
          success: "#32fa5d",
          warning: "#ff922e",
        },
      },
    },
  },

  i18n: {
    strategy: 'no_prefix',
    locales: langs,
    defaultLocale: config.default_language,
    vueI18n: {
      fallbackLocale: config.default_language,
      messages: locales,
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
};
