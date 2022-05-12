<template>
  <v-app-bar app flat class="app-bar-margins borderNone" id="app-bar-id">
    <div class="d-flex mt-8 mx-4" :dir="$dir()">
      <v-autocomplete
        v-model="value"
        :items="filtered"
        prepend-inner-icon="mdi-magnify"
        :label="$t('market_search_bar_placeholder')"
        :placeholder="$t('market_search_bar_placeholder')"
        item-value="id"
        item-text="name"
        full-width
        dense
        outlined
        solo
        chips
        clearable
        hide-selected
        hide-no-data
        append-icon="mdi-chevron-down"
        class="ml-2 global-search"
        ><template v-slot:selection="{ attr, on, item, selected }">
          <v-chip
            v-bind="attr"
            :input-value="selected"
            color="blue-grey"
            class="white--text"
            v-on="on"
          >
            <v-icon left
              >{{
                item.type == "currency"
                  ? " mdi-bitcoin"
                  : "mdi-shopping-outline"
              }}
            </v-icon>
            <span v-text="item.name"></span>
          </v-chip>
        </template>
        <template v-slot:item="{ item }">
          <v-list-item-avatar
            color="primary"
            class="text-h5 font-weight-light white--text"
          >
            <v-img :src="item.logo"></v-img>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title v-text="item.name"></v-list-item-title>
            <v-list-item-subtitle v-text="item.symbol"></v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-icon>{{
              item.type == "currency" ? " mdi-bitcoin" : "mdi-shopping-outline"
            }}</v-icon>
          </v-list-item-action>
        </template></v-autocomplete
      >
    </div>
    <v-spacer></v-spacer>
    <div class="mt-6 mx-4 text-center" style="min-width: 120px">
      <p class="mb-0 pb-0 title-head">Total Balance</p>
      <p class="primary--text title-data">
        $ {{ new Intl.NumberFormat().format(total) }}
      </p>
    </div>
    <div class="mt-6 mx-4 text-center" style="min-width: 120px">
      <p class="mb-0 pb-0 title-head">Profitable Orders</p>
      <p class="primary--text title-data">25/30</p>
    </div>
    <div class="mt-6 mx-4 text-center" style="min-width: 120px">
      <p class="mb-0 pb-0 title-head">Total PLN</p>
      <p class="primary--text title-data">$ 12 460</p>
    </div>
    <v-menu
      transition="slide-y-transition"
      bottom
      right
      :offset-y="true"
      content-class="elevation-1"
      :close-on-content-click="false"
      hide-details
    >
      <template v-slot:activator="{ on }">
        <v-hover v-slot="{ hover }">
          <div
            flat
            class="account-menu d-flex flex-columns align-center mt-2 py-2 pr-2 pl-4"
            v-on="on"
          >
            <div class="mr-2">
              <v-avatar
                size="35"
                :class="hover ? 'avatar' : ''"
                :style="customStyle"
              >
                <img v-if="userAvatar" :src="userAvatar" />
                <v-icon v-else :color="hover ? 'primary' : 'gray'" class="mr-2"
                  >mdi-account</v-icon
                >
              </v-avatar>
            </div>
            <div :class="hover ? 'primary--text' : ''">
              {{ $auth.user.name }}
            </div>
          </div>
        </v-hover>
      </template>
      <v-list class="menu-list">
        <v-list-item
          v-for="(action, i) in account_menu"
          :key="i"
          dense
          @click="action.action"
        >
          <v-list-item-title>{{ $t(action.name) }}</v-list-item-title>
        </v-list-item>
        <v-list-item style="margin-top: 8px"
          ><language-select style="width: 50px"></language-select
        ></v-list-item>
        <!-- <v-list-item style="margin-top: 8px">
          <theme-select style="width: 50px"></theme-select>
        </v-list-item> -->
      </v-list>
    </v-menu>
    <v-menu
      transition="slide-y-transition"
      bottom
      right
      :offset-y="true"
      content-class="elevation-1"
      :close-on-content-click="false"
      hide-details
    >
      <template v-slot:activator="{ on }">
        <v-hover v-slot="{ hover }">
          <v-icon
            v-on="on"
            class="mt-2 icon-bell"
            :color="hover ? 'primary' : 'gray'"
            >{{
              is_nots ? "mdi-bell-badge-outline" : "mdi-bell-outline"
            }}</v-icon
          >
        </v-hover>
      </template>
      <NotHistory></NotHistory>
    </v-menu>

    <template v-slot:extension>
      <!-- <v-col class="ma-0 pa-0"> <Ticker /> </v-col> -->
      <v-row>
        <v-col class="ma-0 pa-0"
          ><marquee id="marquee">
            {{ mar_str }}
          </marquee></v-col
        ></v-row
      >
    </template>
  </v-app-bar>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import LanguageSelect from "~/components/settings/LanguageSelect";
import ThemeSelect from "~/components/settings/ThemeSelect";
import Ticker from "./Ticker";
import NotHistory from "./NotHistory";
import config from "~/config/config.json";

export default {
  data() {
    let stocks = JSON.parse(
      JSON.stringify(this.$store.state.config.data.exchanges)
    );
    return {
      stocks: stocks,
      primary: config.colors.text.primary,
      user_image: null,
      account_menu: this.initAccountMenu(),
      value: null,
      is_nots: true,
      mar_str: "",
      subscrp: [],
      total: null,
      balances: {},
      base_p: this.$store.state.config.data.base_p,
      items: [
        {
          text: "my_wallet",
          route: "/wallet",
        },
        {
          text: "user_commodities",
          route: "/commodities",
        },
        {
          text: "user_arbitrage",
          route: "/arbitrage",
        },
        {
          text: "user_trading",
          route: "/trading",
        },
      ],
    };
  },
  methods: {
    ...mapMutations("config/default", {
      set_val: "set_val",
    }),
    ...mapActions("data/currency", {
      fetchCurrencies: "fetchList",
    }),
    ...mapActions("data/arbitrage_company", {
      fetchAC: "fetchList",
    }),
    ...mapMutations("config/ws", {
      subscribe: "set_top_subscribe",
    }),
    initAccountMenu() {
      return [
        {
          name: "Account",
          action: () => {
            this.$router.push("/settings");
          },
        },
        {
          name: "LogOff",
          action: () => {
            this.auth_logout();
          },
        },
      ];
    },
    wallets_subscribe_definer() {
      let me = this;
      let arr = [];
      this.wallets.forEach((wall, i) => {
        let cr = wall.currency.symbol;
        if (wall.currency.currency_type.key == "CRYPTO") {
          if (wall.balance) {
            arr.push(`${me.base_p}:${cr}-USD@ticker_30s`);
          }
        }
      });
      return arr;
    },
    async auth_logout() {
      this.$auth.logout();
    },
    async close(i, message_id) {},
  },

  watch: {
    balances(v) {
      this.total = 0;
      let fnd = this.wallets.find((el) => el.currency.symbol == "USD");
      if (fnd) {
        this.total = fnd.balance;
      }
      for (let prop in v) {
        this.total += v[prop];
      }
      // console.log("this.total", this.total);
    },
    value(v) {
      let fnd = this.filtered.find((el) => el.id == v);
      if (fnd) {
        if (fnd.type == "arbitrage_company") {
          this.$router.push({
            path: `/markets/${fnd.id}`,
          });
        }
        if (fnd.type == "currency") {
          this.$router.push({
            path: `/currency?id=${fnd.id}`,
          });
        }
      }
      // console.log("selected", v);
    },
    prices_current(v) {
      let me = this;
      let json_d = JSON.parse(JSON.stringify(v));
      // console.log("MARQUE DATA", json_d);
      me.subscrp.forEach((st) => {
        if (json_d && json_d.method == st) {
          let data = json_d.data ? json_d.data.data || [] : [];
          me.set_val(data);
          data.forEach((dtm) => {
            let dt = dtm;
            if (Array.isArray(dtm)) {
              dt = dtm[0];
            }
            if (dt && dt.close) {
              let change = (dt.close - dt.open).toFixed(4);
              let ch_pr = ((change * 100) / dt.close).toFixed(4);
              let color =
                dt.close - dt.open > 0 ? "primary--text" : "red--text";
              let share =
                dt.exchange == "FOREX"
                  ? `${dt.share}/USD`
                  : `${dt.exchange} - ${dt.share}`;
              me.mar_str += `<span class='pr-4'>
              <span class="font-weight-bold" style="color: #9A9A9A">${share}</span>
              <span class="font-weight-medium ${color}"> ${dt.close} ${change} (${ch_pr}) </span>
              </span>`;
            }
            let price_data = {
              price: dt.close ? dt.close : dt.price,
              base: dt.base ? dt.base : dt.share,
            };
            let fnd = me.wallets.find(
              (wl) => wl.currency.symbol == price_data.base
            );
            if (fnd && price_data.price) {
              if (fnd.currency.currency_type.key == "FIAT") {
                price_data.price = 1 / price_data.price;
              }
              me.balances[fnd.currency.symbol] = price_data.price * fnd.balance;
            }
          });
          me.balances = Object.assign({}, me.balances);
        }
      });
      document.getElementById("marquee").innerHTML = me.mar_str;
    },
  },

  components: {
    LanguageSelect,
    ThemeSelect,
    Ticker,
    NotHistory,
  },

  computed: {
    ...mapGetters("data/wallet", {
      wallets: "list",
    }),
    ...mapGetters("config/ws", {
      prices_current: "top_data",
    }),
    ...mapGetters("config/default", {
      get_val: "get_val",
    }),
    userAvatar() {
      try {
        return this.$env("FILE_SERVER_BASE") + this.$auth.user.fs[0]["dir"];
      } catch (e) {
        return null;
      }
    },
    ...mapGetters("data/arbitrage_company", {
      arbitrage_company: "list",
    }),
    ...mapGetters("data/currency", {
      currencies_full: "list",
    }),
    filtered() {
      let res = [];
      this.arbitrage_company.forEach((element) => {
        res.push({
          name: element.name,
          id: element.id,
          type: "arbitrage_company",
          logo: element.logo,
          symbol: element.name,
        });
      });
      let c_f = this.currencies_full;
      let currencies = c_f.filter(
        (el) => el.currency_type && el.currency_type.key == "CRYPTO"
      );
      currencies.forEach((element) => {
        res.push({
          name: element.name,
          id: element.id,
          type: "currency",
          logo: element.logo,
          symbol: element.symbol,
        });
      });
      return res;
    },
    user_in() {
      //   let name = this.$store.state.auth.user.name;
      //   let surname = this.$store.state.auth.user.surname;
      //   let initiales = name && name.length > 0 ? name[0] : "";
      //   initiales += surname && surname.length > 0 ? surname[0] : "";
      return "User";
    },
    customStyle() {
      return {
        "--primary": this.primary,
      };
    },
  },
  mounted() {
    // console.log("this.filtered :>> ", this.filtered);
    window.addEventListener("scroll", (e) => {
      if (window.pageYOffset > 60) {
        document.getElementById("app-bar-id").style.display = "none";
      } else {
        document.getElementById("app-bar-id").style.display = "block";
      }
    });
  },
  created() {
    let me = this;
    me.subscrp = [`${me.base_p}:all@ticker_30s`];
    me.stocks.forEach((element, i) => {
      me.subscrp.push(`shares:all.${element.key}@kline_1d`);
    });
    // let arr_subscr = me.wallets_subscribe_definer();
    // me.subscrp = me.subscrp.concat(arr_subscr);
    console.log("me.subscrp", me.subscrp);
    this.subscribe(Object.assign([], me.subscrp));
  },
};
</script>

<style lang="scss">
.title-head {
  font-size: 14px;
  font-weight: 400;
}
.title-data {
  font-size: 16px;
  font-weight: 700;
}
.account-menu {
  background: transparent !important;
  cursor: pointer;
  width: 150px;
}

#marquee {
  font-size: 12px;
  margin-left: 40px;
}
.v-autocomplete__content {
  width: 262px;
}
.avatar {
  border: 2px solid var(--primary) !important;
}

html[theme="dark"] .global-search .v-input__slot {
  background: rgba(154, 154, 154, 0.3) !important;
  box-shadow: none !important;
}
html[theme="light"] .global-search .v-input__slot {
  // background: rgba(255, 255, 255) !important;
  background: rgba(154, 154, 154, 0.3) !important;
  box-shadow: none !important;
}

.global-search fieldset {
  border: none !important;
}

.navLink {
  text-transform: none;
}

.app-bar-margins {
  margin-right: 80px;
}

.icon-bell {
  cursor: pointer;
}

html[theme="light"] {
  .account-menu {
    background: transparent !important;
  }
}
.goToAction {
  font-size: 16px !important;
  line-height: 20px !important;
  letter-spacing: 0 !important;
}
</style>
