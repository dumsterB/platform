<template>
  <div id="dir-rtl" :dir="$dir()">
    >
    <v-app>
      <LoadingScreen :isLoading="isLoading" />
      <div v-if="!isLoading" class="main-page mb-16">
        <SnackBar />
        <Menu />
        <NavBar dir="ltr" />
        <v-main fluid class="mb-16">
          <v-container fluid class="layout_default__content mt-5 ma-0 pa-0">
            <nuxt />
          </v-container>
        </v-main>
      </div>
      <Footer />
    </v-app>
  </div>
</template>

<script>
import SnackBar from "../components/layout/Notification";
import NavBar from "~/components/layout/NavBar";
import Menu from "~/components/layout/Menu";
import Footer from "~/components/layout/Footer";
import LoadingScreen from "~/components/layout/LoadingScreen";
import { mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      isLoading: true,
      interv: null,
    };
  },
  computed: {
    CURRENT_LOCALE() {
      return this.$i18n.locale;
    },
  },
  watch: {
    CURRENT_LOCALE() {
      console.log("CURRENT_LOCALE", this.CURRENT_LOCALE);
    },
    dir() {
      if (this.dir == "rtl") {
        this.$vuetify.rtl = true;
      } else {
        this.$vuetify.rtl = false;
      }
    }
  },
  methods: {
    async preload_models() {
      let htmlElement = document.documentElement;
      let theme = localStorage.getItem("theme");
      if (!theme) {
        theme = "light";
      }
      let lang = localStorage.getItem("language");
      if (!lang) {
        lang = this.$i18n.locale;
      }
      if (theme == "dark") {
        this.$vuetify.theme.dark = true;
      }
      localStorage.setItem("theme", theme);
      localStorage.setItem("language", lang);
      this.$i18n.locale = lang;
      // console.log('this.$i18n', this.$i18n)
      htmlElement.setAttribute("theme", theme);
      if (this.$store.state.auth.user) {
        let models = this.$store.state.config.data.preload_models;
        for (let i = 0; i < models.length; i++) {
          let res = await this.$store.dispatch(`data/${models[i]}/fetchList`);
        }
      }
    },
  },
  async created() {
    if (this.$store.state.auth.user) {
      global.socket = new WebSocket(this.$env("WS_SERVER_BASE"));
      this.interv = setInterval(() => {
        let ws = global.socket;
        if (ws.readyState !== ws.OPEN) {
          global.socket = new WebSocket(this.$env("WS_SERVER_BASE"));
        }
      }, 10000);
      await this.preload_models();
    } else {
      if (this.$router.history.current.path != "/auth/registration") {
        this.$router.push({
          path: "/auth/login",
        });
      }
    }
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  },
  components: {
    NavBar,
    Menu,
    LoadingScreen,
    Footer,
    SnackBar,
  },
  beforeDestroy() {
    if (this.interv) {
      clearInterval(this.interv);
    }
  },
};
</script>

<style>
html {
  font-family: "Cera Pro";
  height: 100%;
  font-style: normal;
  font-weight: normal;
  background-repeat: no-repeat;
  -webkit-transition: 223ms;
  -o-transition: 223ms;
  transition: 223ms;
  min-width: 1200px !important;
}
div {
  font-family: "Cera Pro";
}
</style>
