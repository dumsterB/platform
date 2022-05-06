<template>
  <div class="page-container">
    <v-row>
      <v-col :lg="9" :md="12" class="pt-4">
        <v-card class="ml-4">
          <v-row class="justify-start align-center">
            <v-col :cols="4" class="pa-0 ma-0 mb-4">
              <v-autocomplete
                class="crypto-select ml-4 mt-4"
                v-model="curr_id"
                :items="currencies"
                item-text="name"
                item-value="id"
                dense
                outlined
                hide-details
                ><template v-slot:selection="{ item }">
                  <v-chip
                    class="ma-0 pa-0"
                    style="background: transparent !important"
                  >
                    <v-row class="ma-0 pa-0">
                      <img height="20" :src="item.logo" alt="" class="mr-2" />
                      <strong>{{ item.name }}</strong>
                      <span class="ml-2 icon_color--text font-weight-bold">
                        {{ item.symbol }}</span
                      >
                    </v-row>
                  </v-chip>
                </template>
                <template v-slot:item="{ item }">
                  <div class="d-flex">
                    <img height="20" :src="item.logo" alt="" />
                    <div class="d-flex ml-3">
                      <strong>{{ item.name }}</strong>
                      <span class="ml-2 icon_color--text font-weight-bold">
                        {{ item.symbol }}</span
                      >
                    </div>
                  </div></template
                ></v-autocomplete
              >
            </v-col>
            <v-col :cols="8" class="pa-0 ma-0">
              <Indicators
                v-if="page_state == 0"
                :currency="curr_code"
                :price="price"
                :change="change"
                :low="low"
                :high="high"
              ></Indicators>
              <Platforms
                v-if="page_state == 1"
                :currency="curr_code"
                :prices="arb_data"
                @clicked="platform_changed"
              ></Platforms>
            </v-col>
          </v-row>
        </v-card>
        <v-row class="mt-2 ml-1 mt-4">
          <v-col class="ma-0" v-if="page_state != 2">
            <OrderBook :currency="curr_code" :price="price" :change="change" />
          </v-col>
          <v-col :cols="8">
            <v-row>
              <v-col class="pl-0 pr-1">
                <v-btn
                  large
                  block
                  class="menu-curr-buttons"
                  :class="page_state == 0 ? 'primary' : ''"
                  @click="page_state = 0"
                  >{{ $t("spot_title") }}</v-btn
                >
              </v-col>
              <v-col class="pl-0 pr-1" v-if="curr_crypto">
                <v-btn
                  large
                  block
                  class="menu-curr-buttons"
                  :class="page_state == 1 ? 'primary' : ''"
                  @click="page_state = 1"
                  >{{ $t("user_arbitrage") }}</v-btn
                >
              </v-col>
              <v-col class="pl-0 pr-0">
                <v-btn
                  large
                  block
                  class="menu-curr-buttons"
                  :class="page_state == 2 ? 'primary' : ''"
                  @click="page_state = 2"
                  >{{ $t("leverage") }}</v-btn
                >
              </v-col>
            </v-row>
            <v-row v-if="graph_key && page_state != 2">
              <v-col class="pl-0">
                <TradeGraph
                  :width="graphWidth"
                  :height="graphHeight"
                  :key_g="graph_key"
                ></TradeGraph>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
      <v-col :lg="3" :md="6" class="pt-0 pl-0">
        <SpotCard
          v-if="page_state == 0"
          :currency="curr_code"
          :price="price"
          @reload="reload_trade"
        ></SpotCard>
        <TableAC
          v-if="page_state == 1"
          :currency="curr_code ? curr_code : undefined"
          :prices="arb_data"
          :current="current"
          @reload="reload"
          class="ml-4"
        ></TableAC>
      </v-col>
    </v-row>
    <v-row v-if="page_state == 2">
      <v-col>
        <Leverage :currency="current"></Leverage>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <TableTrades
          v-if="trade_filter && page_state == 0"
          :prices="prices"
          :filter="trade_filter"
          ref="trades"
          ><template v-slot:header
            ><v-list max-width="600" min-width="480" class="pa-0 borderNone">
              <v-list-item-group v-model="trade_mode_active" class="d-flex"
                ><v-list-item
                  tag="button"
                  block
                  elevation="0"
                  class="btn_tbl pa-0"
                  active-class="active_btn_tbl primary--text"
                  @click="trade_filter_update('1')"
                  >{{ $t("Open Trades") }}</v-list-item
                >
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-list-item
                  tag="button"
                  block
                  elevation="0"
                  class="btn_tbl pa-0"
                  active-class="active_btn_tbl primary--text"
                  @click="trade_filter_update('3')"
                  >{{ $t("Orders History") }}</v-list-item
                >
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-list-item
                  tag="button"
                  block
                  elevation="0"
                  class="btn_tbl pa-0"
                  active-class="active_btn_tbl primary--text"
                  @click="trade_filter_update('1')"
                  >{{ $t("Trade History") }}</v-list-item
                ></v-list-item-group
              ></v-list
            >
            <v-divider class="mx-4" inset vertical></v-divider></template
        ></TableTrades>
        <TableASession
          v-if="as_filter && page_state == 1"
          :prices="prices"
          :filter="as_filter"
          title="table_position"
          ref="a_session"
          ><template v-slot:header
            ><v-list max-width="600" min-width="480" class="pa-0 borderNone">
              <v-list-item-group v-model="as_mode_active" class="d-flex"
                ><v-list-item
                  tag="button"
                  block
                  elevation="0"
                  class="btn_tbl pa-0"
                  active-class="active_btn_tbl primary--text"
                  @click="as_filter_update('1')"
                  >{{ $t("Open Trades") }}</v-list-item
                >
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-list-item
                  tag="button"
                  block
                  elevation="0"
                  class="btn_tbl pa-0"
                  active-class="active_btn_tbl primary--text"
                  @click="as_filter_update('2')"
                  >{{ $t("Orders History") }}</v-list-item
                >
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-list-item
                  tag="button"
                  block
                  elevation="0"
                  class="btn_tbl pa-0"
                  active-class="active_btn_tbl primary--text"
                  @click="as_filter_update('1')"
                  >{{ $t("Trade History") }}</v-list-item
                ><v-divider class="mx-4" inset vertical></v-divider></v-list-item-group
              ></v-list
            >
            </template
        ></TableASession>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import Indicators from "~/components/elements/currencies/Indicators";
import TradeGraph from "~/components/graphs/Trade";
import TableTrades from "~/components/data/TableTrades";
import TableAC from "~/components/data/TableAC";
import TableASession from "~/components/data/TableASession";
import SpotCard from "~/components/elements/currencies/SpotCard";
import Platforms from "~/components/elements/currencies/Platforms";
import Leverage from "~/components/elements/Leverage";
import OrderBook from "~/components/elements/exchange/OrderBook";
const model = "data/currency";

export default {
  components: {
    Indicators,
    TradeGraph,
    TableTrades,
    TableAC,
    Platforms,
    SpotCard,
    TableASession,
    Leverage,
    OrderBook,
  },
  data() {
    let stocks = JSON.parse(
      JSON.stringify(this.$store.state.config.data.exchanges)
    );
    return {
      page_state: 0,
      curr_id: null,
      curr_code: null,
      current: {},
      graphWidth: this.initGrpaphWidth(),
      graphHeight: 600,
      selected_platform: "binance",
      base_p: this.$store.state.config.data.base_p,
      price: null,
      change: null,
      low: null,
      high: null,
      stocks: stocks,
      prices: [],
      arb_data: [],
      as_filter: null,
      arr_subscr: [],
      curr_subscr: "",
      trade_filter: null,
      interv: null,
      trade_mode_active: 0,
      as_mode_active: 0,
    };
  },
  computed: {
    ...mapGetters(model, {
      currencies_full: "list",
      curr_by_id: "byId",
    }),
    ...mapGetters("data/wallet", {
      wallets: "list",
    }),
    ...mapGetters("data/trade", {
      trades: "list",
    }),
    ...mapGetters("data/arbitrage_session", {
      as_list: "list",
    }),
    ...mapGetters("config/ws", {
      prices_current: "page_data",
    }),
    ...mapGetters("config/default", {
      get_val: "get_val",
    }),
    currencies() {
      let c_f = this.currencies_full;
      if (!this.curr_crypto) {
        return c_f.filter(
          (el) => el.currency_type && el.currency_type.key != "CRYPTO"
        );
      } else {
        return c_f.filter(
          (el) => el.currency_type && el.currency_type.key == "CRYPTO"
        );
      }
    },
    curr_crypto() {
      return (
        this.current &&
        this.current.currency_type &&
        this.current.currency_type.key == "CRYPTO"
      );
    },
    graph_key() {
      if (this.curr_crypto) {
        return this.selected_platform + ":" + this.curr_code + "USD";
      } else if (this.current && this.current.exchange_type) {
        let k = this.stocks.find(
          (el) => el.key == this.current.exchange_type.key
        );
        if (this.current && this.current.currency_type.key == "FIAT") {
          return this.curr_code + "USD";
        }
        let kk = !k ? "LSE" : k.tv;
        if (this.curr_code == "BABA") {
          kk = "NYSE";
        }
        if (this.curr_code == "R6C0") {
          kk = "XETR";
        }
        return kk + ":" + this.curr_code;
      }
    },
  },
  watch: {
    curr_id() {
      if (this.curr_id) {
        this.trade_filter = {
          trade_status_id: "1",
        };
        this.current = this.curr_by_id(this.curr_id) || {};
        this.curr_code = this.current.symbol;
      }
    },
    curr_code() {
      this.as_filter = {
        // "wallet[currency_id]": this.curr_id,
        status_id: "1",
      };
      (this.price = null), (this.change = null);
      this.low = null;
      this.high = null;
      if (this.curr_code && this.page_state == 0) {
        this.spot_sockets();
      }
      if (this.curr_code && this.page_state == 1) {
        this.arbitrage_sockets();
      }
    },
    "$route.params.search": {
      handler: function (search) {
        if (
          this.$router.currentRoute.query &&
          this.$router.currentRoute.query.id
        ) {
          this.curr_id = parseInt(this.$router.currentRoute.query.id);
        }
      },
      deep: true,
      immediate: true,
    },
    page_state() {
      if (this.page_state == 0) {
        this.spot_sockets();
      } else if (this.page_state == 1) {
        this.arbitrage_sockets();
      } else if (this.page_state == 2) {
        this.unsubscribe();
      }
    },
    selected_platform() {
      this.arbitrage_sockets();
    },
    prices_current(v) {
      let me = this;
      let json_d = JSON.parse(JSON.stringify(v));
      me.arr_subscr.forEach((el) => {
        if (json_d && json_d.method == el) {
          let data = json_d.data ? json_d.data.data || [] : [];
          if (me.page_state == 0) {
            if (data.length > 0) {
              me.price_update(data[0]);
            }
          } else if (me.page_state == 1) {
            if (el == `${me.base_p}:all@ticker_10s`) {
              me.prices = data;
            } else {
              me.arb_data = data;
            }
          }
        }
      });
    },
  },
  methods: {
    ...mapActions(model, {
      fetchCurrencies: "fetchList",
    }),
    ...mapActions("data/arbitrage_company", {
      fetchAC: "fetchList",
    }),
    ...mapActions("data/trade", {
      fetchTrades: "fetchList",
    }),
    ...mapActions("data/arbitrage_session", {
      fetchAS: "fetchList",
    }),
    ...mapMutations("config/ws", {
      unsubscribe: "unsubscribe_page",
      subscribe: "set_page_subscribe",
      add_subscribe: "add_page_subscribe",
      del_subscribe: "del_page_subscribe",
    }),
    async reload() {
      await this.$refs.a_session.reload();
    },
    async reload_trade() {
      await this.$refs.trades.reload();
    },
    onResize(event) {
      this.graphWidth = this.initGrpaphWidth();
    },
    initGrpaphWidth() {
      if (window.innerWidth > 1300) {
        return parseInt(((window.innerWidth - 350) * 1) / 2);
      } else {
        return parseInt(((window.innerWidth - 350) * 2) / 3);
      }
    },
    platform_changed(platform) {
      this.selected_platform = platform;
    },
    trade_filter_update(dt) {
      this.trade_filter = {
        trade_status_id: dt,
      };
    },
    as_filter_update(dt) {
      this.as_filter = {
        status_id: dt,
      };
    },
    trades_subscribe_definer(bool) {
      let me = this;
      let str = "";
      let arr = [];
      this.trades.forEach((wall, i) => {
        let p_arr = ["dest_currency", "source_currency"];
        for (let i = 0; i < 2; i++) {
          let curr = wall[p_arr[i]];
          let cr = curr.symbol;
          let dt = me.get_val(cr);
          if (dt) {
            me.price_update(dt);
          }
          if (curr.currency_type.key == "CRYPTO") {
            let st = `${me.base_p}:${cr}-USD@ticker_10s`;
            let fnd = arr.find((el) => el == st);
            if (!fnd) {
              str += `"${st}"`;
              arr.push(st);
              str += ",";
            }
          } else {
            let ex_t = curr.exchange_type.key;
            if (cr != "USD") {
              let st = `shares:${cr}.${ex_t}@kline_1d`;
              let fnd = arr.find((el) => el == st);
              if (!fnd) {
                str += `"${st}"`;
                arr.push(st);
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
    price_update(data) {
      let me = this;
      let add_data = {
        price: data.close ? 1 / data.close : data.price,
        base: data.base ? data.base : data.share,
      };
      let fnd = me.prices.find((el) => el && el.base == add_data.base);
      if (fnd) {
        fnd.price = add_data.price;
      } else {
        me.prices.push(add_data);
      }
      if (add_data.base == me.curr_code) {
        if (me.current.currency_type.key != "CRYPTO") {
          if (me.ex_type == "FOREX") {
            me.price = Math.round(10000000 / data.close) / 10000000;
            let open = Math.round(10000000 / data.open) / 10000000;
            me.change = me.price - open;
            me.low = Math.round(10000000 / data.low) / 10000000;
            me.high = Math.round(10000000 / data.high) / 10000000;
          } else {
            me.price = data.close;
            me.change = data.close - data.open;
            me.low = Math.round(100000 * data.low) / 100000;
            me.high = Math.round(100000 * data.high) / 100000;
          }
        } else {
          me.price = data.price;
          me.change = data.change_24h;
          me.low = data.low_24h;
          me.high = data.high_24h;
        }
      }
    },
    spot_sockets() {
      let me = this;
      let obj = me.trades_subscribe_definer();
      this.unsubscribe();
      me.arr_subscr = obj.arr;
      let dt = me.get_val(me.curr_code);
      if (dt) {
        me.price_update(dt);
      }
      if (this.curr_crypto) {
        me.arr_subscr.push(`${me.base_p}:${me.curr_code}-USD@ticker_5s`);
      } else {
        me.ex_type = me.current.exchange_type.key;
        me.arr_subscr.push(`shares:${me.curr_code}.${me.ex_type}@kline_1d`);
      }
      this.subscribe(Object.assign([], me.arr_subscr));
      // console.log("me.str_subscr", me.str_subscr);
    },
    arbitrage_sockets() {
      let me = this;
      this.unsubscribe();
      me.arr_subscr = [`all:${me.curr_code}-USD@ticker_5s`, `${me.base_p}:all@ticker_10s`];
      this.subscribe(Object.assign([], me.arr_subscr));
    },
  },
  async mounted() {
    window.addEventListener("resize", this.onResize);
    setTimeout(() => {
      this.prices = Object.assign([], this.prices);
    }, 2000);
    this.interv = setInterval(() => {
      this.prices = Object.assign([], this.prices);
    }, 8000);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
  },
  destroyed() {
    this.unsubscribe();
    if (this.interv) {
      clearInterval(this.interv);
    }
  },
};
</script>
<style>
.btn_tbl {
  padding: 10px 10px 10px 0px;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  width: 100px;
  border-top: 3px solid transparent;
  background: transparent !important;
}
.active_btn_tbl {
  position: relative;
  padding: 10px 10px 10px 0px;
  justify-content: center;
  margin-top: 0px;
  font-weight: 700;
  font-size: 16px;
  border-top: 3px solid transparent;
  background: transparent !important;
}
.active_btn_tbl::after {
  position: absolute;
  content: "";
  width: 100%;
  min-height: 6px !important;
  top: -8px;
  left: 0;
  background: #007bff !important;
  border-radius: 0px 0px 4px 4px;
}
.menu-curr-buttons {
  border-radius: 10px;
}
.menu-curr-buttons:not(.primary) {
  background: #161f49 !important;
}
html[theme="light"] .menu-curr-buttons:not(.primary) {
  background: #ffffff !important;
}
.crypto-select fieldset {
  border: none !important;
}
</style>
