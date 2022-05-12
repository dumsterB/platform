<template>
  <div id="dir-rtl" :dir="$dir()">
    <v-app>
      <LoadingScreen :isLoading="isLoading" />
      <div v-if="!isLoading" class="main-page mb-16">
        <SnackBar />
        <Menu />
        <NavBar dir="ltr" />
        <v-main fluid class="mb-16 mr-8">
          <v-container fluid class="layout_default__content">
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
      interv2: null,
    };
  },
  computed: {
    CURRENT_LOCALE() {
      return this.$i18n.locale;
    },
    ...mapGetters("data/credit_session", {
      credit_session: "list",
    }),
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
    },
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
      // if (theme == "dark") {
      //   this.$vuetify.theme.dark = true;
      // }
      this.$vuetify.theme.dark = true;
      // localStorage.setItem("theme", theme);
      localStorage.setItem("language", lang);
      this.$i18n.locale = lang;
      // console.log('this.$i18n', this.$i18n)
      htmlElement.setAttribute("theme", "dark");
      if (this.$store.state.auth.user) {
        let models = this.$store.state.config.data.preload_models;
        for (let i = 0; i < models.length; i++) {
          let res = await this.$store.dispatch(`data/${models[i]}/fetchList`);
        }
      }
    },
    notification_socket() {
      let user_id = this.$auth.user.id;
      // console.log("user_id", user_id);
      let cntx = "platform";
      let ws_query = `${this.$env(
        "WS_STORE_SERVER"
      )}?user_id=${user_id}&ws_context=${cntx}`;
      let store_socket = new WebSocket(ws_query);
      store_socket.onmessage = (event) => {
        this.notification_listener(event);
      };
      this.interv2 = setInterval(() => {
        if (store_socket.readyState !== store_socket.OPEN) {
          store_socket = new WebSocket(ws_query);
          store_socket.onmessage = (event) => {
            this.notification_listener(event);
          };
        }
      }, 3000);
    },
    notification_listener(event) {
      if (event.data) {
        let json_d = JSON.parse(event.data);
        // console.log("notification_listener", json_d);
        if (json_d && json_d.method == "notification") {
          let data = json_d.data;
          if (data) {
            let color = "primary";
            setTimeout(() => {
              this.$store.commit("data/notifications/create", {
                id: color + "_" + Math.random().toString(36),
                title: data.title,
                text: data.notification,
                color: color,
                timeout: 86400000,
              });
            }, 2000);
          }
        }
      }
    },
  },
  async created() {
    if (this.$store.state.auth.user) {
      this.$store.dispatch(`config/ws/init`, {
        url: this.$env("WS_SERVER_BASE"),
      });
      await this.preload_models();
      this.notification_socket();
      // await this.check_credit_prices();
    } else {
      if (this.$router.history.current.path != "/auth/registration") {
        this.$router.push({
          path: "/auth/login",
        });
      }
    }
    setTimeout(() => {
      this.isLoading = false;
    }, 500);
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
    if (this.interv2) {
      clearInterval(this.interv2);
    }
  },
};
</script>

<style>
html {
  font-family: "Montserrat";
  height: 100%;
  font-style: normal;
  font-weight: normal;
  background-repeat: no-repeat;
  -webkit-transition: 223ms;
  -o-transition: 223ms;
  transition: 223ms;
}
div {
  font-family: "Montserrat";
}
.page-container {
  margin-right: 20px;
}
.layout_default__content {
  margin-top: 10px;
  padding-top: 0px;
}
</style>
