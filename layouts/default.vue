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
    async check_credit_prices() {
      let me = this;
      await this.$store.dispatch(`data/credit_session/fetchList`, {
        config: {
          params: {
            status_id: 1,
          },
        },
      });
      let socket = global.socket;
      let subscr_obj = me.sessions_subscribe_definer();
      socket.send(`{
        "method": "subscribe",
        "data": [${subscr_obj.str}]
      }`);
      console.log("subscr_obj", subscr_obj);
      socket.onmessage = function (event) {
        if (event.data) {
          let json_d = JSON.parse(event.data);
          subscr_obj.arr.forEach((el) => {
            if (json_d && json_d.method == el) {
              let data = json_d.data ? json_d.data.data || [] : [];
              if (data.length > 0) {
                me.check_credit(data[0]);
              }
            }
          });
        }
      };
    },
    check_credit(data) {
      let not_count_str = localStorage.getItem('not_count');
      let not_count = {};
      if (not_count_str) {
        not_count = JSON.parse(not_count_str);
      }
      this.credit_session.forEach((el) => {
        if (
          el.wallet.currency.symbol == data.base &&
          el.arbitrage_company.name == data.company
        ) {
          let fnd = el;
          let price = data.price;
          let sign = fnd.session_start_type.key == "BUY" ? -1 : 1;
          let curr_am = (fnd.amount * fnd.start_exchange_rate) / price;
          let lose = (sign * (fnd.amount - curr_am)) / fnd.self_amount;
          console.log("lose", fnd, lose);
          if (lose > 0.5 && lose < 0.7) {
            if (!not_count[fnd.id]) not_count[fnd.id] = 0;
            if (not_count[fnd.id] == 0) {
              setTimeout(() => {
                this.$store.commit("data/notifications/create", {
                  id: "red_" + Math.random().toString(36),
                  title: this.$t("credit_arbitrage_session"),
                  text: this.$t("session_lost_50%"),
                  color: "red",
                });
              }, 2000);
              not_count[fnd.id] += 1;
            }
          }
          if (lose > 0.7) {
            if (not_count[fnd.id] == 1) {
              setTimeout(() => {
                this.$store.commit("data/notifications/create", {
                  id: "red_" + Math.random().toString(36),
                  title: this.$t("credit_arbitrage_session"),
                  text: this.$t("session_lost_70%"),
                  color: "red",
                });
              }, 2000)
              not_count[fnd.id] += 1;
            }
          }
          if (lose > 0.99) {
            let as_data = JSON.parse(JSON.stringify(fnd));
            as_data.status_id = 2;
            as_data.stop_exchange_rate = price ? price : 1;
            this.$store.dispatch(`data/credit_session/replace`, { data: as_data, id: as_data.id });
            setTimeout(() => {
              this.$store.commit("data/notifications/create", {
                id: "red_" + Math.random().toString(36),
                title: this.$t("credit_arbitrage_session"),
                text: this.$t("session_auto_closed"),
                color: "red",
              });
            }, 2000);
          }
        }
      });
      localStorage.setItem('not_count', JSON.stringify(not_count));
    },
    sessions_subscribe_definer() {
      let me = this;
      let str = "";
      let arr = [];
      this.credit_session.forEach((arb_s, i) => {
        let curr = arb_s.wallet.currency;
        let cr = curr.symbol;
        let arb_comp = arb_s.arbitrage_company.name;
        if (curr.currency_type.key == "CRYPTO") {
          let st = `${arb_comp}_${cr}-USD@ticker_30s`;
          let fnd = arr.find((el) => el == st);
          if (!fnd) {
            str += `"${st}"`;
            arr.push(`${arb_comp}_${cr}-USD@ticker_30s`);
            str += ",";
          }
        }
      });
      if (str) {
        str = str.slice(0, -1);
      }
      return {
        str: str,
        arr: arr,
      };
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
      }, 3000);
      await this.preload_models();
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
