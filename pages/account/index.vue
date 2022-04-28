<template>
  <div class="page-container">
    <v-row>
      <v-col class="pt-0">
        <div
          class="d-flex mr-6 mdc-form-field--space-between justify-content-beetween currencyNavbar"
        >
          <div>
            <p class="text-h6 ml-10">{{ $t("markets") }}</p>
          </div>
          <div class="d-flex mb-4">
            <p elevation="0" class="mr-4 mt-2">
              <v-icon>mdi-filter</v-icon> {{ $t("filters") }}
            </p>
            <!-- <v-text-field
              :label="$t('market_search_bar_placeholder')"
              v-model="search"
              solo
              outlined
              class="searchCurrency"
              dense
              prepend-inner-icon="mdi-magnify"
            ></v-text-field> -->
          </div>
        </div>
        <v-row class="ml-3 mr-3">
          <v-col v-for="(curr, i) in f_currs" :key="i">
            <Currency
              :currency="curr"
              :companies="companies"
              :tooltip="true"
              :id="`ttp-${curr.symbol}`"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col :cols="12" :md="8" :lg="8" :sm="12" :xs="12">
        <div class="mt-4">
          <p class="text-h6 ml-10">{{ $t("Top") }}</p>
          <TableTop :price="prices"></TableTop>
        </div>
      </v-col>
      <v-col :cols="12" :md="4" :lg="4" :sm="12" :xs="12">
        <Exchange :currency="currs" @reload="reload_wallet"></Exchange>
        <Wallet ref="wallet" :prices="prices"></Wallet>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import Currency from "~/components/elements/Currency";
import Wallet from "../../components/elements/Wallet";
import Exchange from "../../components/elements/exchange";
import TableTop from "../../components/data/TableTop";
const model = "data/currency";

export default {
  components: {
    Currency,
    Wallet,
    Exchange,
    TableTop,
  },
  data() {
    let mi = parseInt(window.innerWidth / 280);
    return {
      currs: [],
      companies: [],
      base_p: this.$store.state.config.data.base_p,
      waiter: {},
      prices: [],
      search: "",
      f_currs: [],
      subscr: "",
      com_prices: [],
      max_items: mi,
      windowWidth: window.innerWidth,
    };
  },
  computed: {
    ...mapGetters(model, {
      currencies_full: "list",
    }),
    ...mapGetters("data/default", {
      default_gate_all: "default_gate_all",
    }),
    currencies() {
      let c_f = this.currencies_full;
      return c_f.filter(
        (el) => el.currency_type && el.currency_type.key == "CRYPTO"
      );
    },
    ...mapGetters("data/arbitrage_company", {
      arbitrage_company: "list",
    }),
    ...mapGetters("data/wallet", {
      wallets: "list",
    }),
    innerwidth() {
      console.log("window.innerWidth", window.innerWidth);
      return window.innerWidth;
    },
    ...mapGetters("config/ws", {
      prices_current: "page_data",
    }),
  },
  watch: {
    search() {
      this.search_f();
    },
    prices_current(v) {
      let json_d = Object.assign({}, v);
      let me = this;
      if (json_d && json_d.method == `${me.base_p}_all@ticker_10s`) {
        let data = json_d.data ? json_d.data.data || [] : [];
        me.prices = data.concat(me.com_prices);
        me.init_currs();
        // console.log(json_d.method, currs, data)
      }
      me.subscr_arr.forEach((el) => {
        if (json_d && json_d.method == el) {
          let data = json_d.data ? json_d.data.data || [] : [];
          if (data.length > 0) {
            me.price_update(data[0]);
            me.prices = me.prices.concat(me.com_prices);
          }
        }
      });
      let s_method = json_d.method.slice(0, 3);
      if (json_d && s_method == "all") {
        let data = json_d.data ? json_d.data.data || [] : [];
        let crs = me.arbitrage_company.map((el) => {
          let res = {
            id: el.id,
            name: el.name,
          };
          let fnd = data.find((e) => e && e.company == el.name);
          if (fnd) {
            res.price = fnd.price;
          }
          return res;
        });
        let companies = crs.filter((el) => {
          return el.price ? true : false;
        });
        me.companies = companies;
      }
    },
  },
  methods: {
    ...mapActions(model, {
      fetchCurrencies: "fetchList",
    }),
    ...mapActions("data/arbitrage_company", {
      fetchAC: "fetchList",
    }),
    ...mapActions("data/wallet", {
      fetchWallet: "fetchList",
    }),
    onResize() {
      this.windowWidth = window.innerWidth;
    },
    ...mapMutations("config/ws", {
      unsubscribe: "unsubscribe_page",
      subscribe: "set_page_subscribe",
      add_subscribe: "add_page_subscribe",
      del_subscribe: "del_page_subscribe",
    }),
    search_f() {
      let me = this;
      if (me.search) {
        me.f_currs = me.currs.filter((el) => {
          return (
            (el.name &&
              el.name.toLowerCase().includes(this.search.toLowerCase())) ||
            (el.symbol &&
              el.symbol.toLowerCase().includes(this.search.toLowerCase()))
          );
        });
      } else {
        me.f_currs = me.currs.slice(0, me.max_items);
      }
    },
    init_currs() {
      let me = this;
      let data =
        me.prices && me.prices.length
          ? me.prices
          : this.$store.getters["config/default/gate_all"];
      let currs = me.currencies.map((el) => {
        let res = {
          id: el.id,
          symbol: el.symbol,
          name: el.name,
          logo: el.logo,
        };
        let fnd = data.find((e) => e && e.base == el.symbol);
        if (fnd) {
          res.price = fnd.price;
          res.change = fnd.change;
          res.change_p = (
            (parseFloat(fnd.change) * 100) /
            parseFloat(fnd.price)
          ).toFixed(4);
        }
        return res;
      });
      let f_currs = currs.filter((el) => el.price);
      me.currs = f_currs;
      me.f_currs = f_currs.slice(0, me.max_items);
    },
    reload_wallet() {
      this.$refs.wallet.counter = 1;
      this.init_currs();
    },
    price_update(data) {
      let add_data = {
        price: data.close ? 1 / data.close : data.price,
        base: data.base ? data.base : data.share,
      };
      let fnd = this.com_prices.find((el) => el && el.base == add_data.base);
      if (fnd) {
        fnd.price = add_data.price;
      } else {
        this.com_prices.push(add_data);
      }
    },
    wallets_subscribe_definer() {
      let str = "";
      let arr = [];
      this.wallets.forEach((wall, i) => {
        if (wall.currency) {
          let cr = wall.currency.symbol;
          if (wall.currency.currency_type.key != "CRYPTO") {
            let ex_t = wall.currency.exchange_type.key;
            if (cr != "USD") {
              str += `"shares_${cr}.${ex_t}@kline_1d"`;
              arr.push(`shares_${cr}.${ex_t}@kline_1d`);
              if (i < this.wallets.length - 1) {
                str += ",";
              }
            }
          }
        }
      });
      return {
        str: str,
        arr: arr,
      };
    },
  },

  async created() {
    this.init_currs();
    let subscr_obj = this.wallets_subscribe_definer();
    console.log("subscr_obj", subscr_obj);
    this.subscr = `"${this.base_p}_all@ticker_10s"`;
    if (subscr_obj.str) {
      this.subscr += `, ${subscr_obj.str}`;
    }
    this.subscr_arr = subscr_obj.arr;
    this.subscr_arr.unshift(`${this.base_p}_all@ticker_10s`);
    this.subscribe(Object.assign([], this.subscr_arr));
  },
  mounted() {
    let me = this;
    window.addEventListener("resize", this.onResize);
    let int = setInterval(() => {
      let test_case = document.getElementById(`ttp-BTC`);
      if (test_case) {
        setTimeout(() => {
          me.currencies.forEach((currency) => {
            let sym = currency.symbol;
            let test = document.getElementById(`ttp-${sym}`);
            if (test) {
              test.addEventListener(
                "mouseenter",
                function (event) {
                  me.companies = [];
                  me.waiter[sym] = true;
                  setTimeout(() => {
                    if (me.waiter[sym]) {
                      me.add_subscribe(`all_${sym}-USD@ticker_10s`);
                    }
                  }, 500);
                },
                false
              );

              test.addEventListener(
                "mouseleave",
                function (event) {
                  me.waiter[sym] = false;
                  me.del_subscribe(`all_${sym}-USD@ticker_10s`);
                },
                false
              );
            }
          });
          clearInterval(int);
        }, 400);
      }
    }, 1000);
  },
  destroyed() {
    window.removeEventListener("resize", this.onResize);
    this.unsubscribe();
  },
};
</script>
<style>
.currencyNavbar .v-input__control {
  width: 40% !important;
}
</style>
