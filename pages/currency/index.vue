<template>
  <div class="page-container">
    <v-row class="justify-start align-center">
      <v-col :cols="6">
        <v-row>
          <v-col :cols="8" class="pl-6">
            <v-row v-if="curr_crypto" class="mt-2 ml-2">
              <v-col :lg="4" class="pl-0 pr-1">
                <v-btn
                  small
                  block
                  :class="page_state == 0 ? 'primary' : 'primary--text'"
                  @click="page_state = 0"
                  >{{ $t("spot_title") }}</v-btn
                >
              </v-col>
              <v-col :lg="4" class="pl-0">
                <v-btn
                  small
                  block
                  :class="page_state == 1 ? 'primary' : 'primary--text'"
                  @click="page_state = 1"
                  >{{ $t("user_arbitrage") }}</v-btn
                >
              </v-col>
              <v-col :lg="4" class="pl-0 pr-0">
                <v-btn
                  small
                  block
                  :class="page_state == 2 ? 'primary' : 'primary--text'"
                  @click="page_state = 2"
                  >{{ $t("leverage") }}</v-btn
                >
              </v-col>
            </v-row>
          </v-col>
          <v-col :cols="4">
            <v-autocomplete
              class="crypto-select ml-4 mt-4"
              v-model="curr_id"
              :items="currencies"
              item-text="name"
              item-value="id"
              outlined
              dense
              hide-details
              :label="$t('cryptocurrency')"
            ></v-autocomplete>
          </v-col>
        </v-row>
      </v-col>
      <v-col :cols="6" class="mt-3">
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
    <v-row v-if="page_state == 2">
      <v-col>
        <Leverage :currency="current"></Leverage>
      </v-col>
    </v-row>
    <v-row>
      <v-col :lg="8" :md="12">
        <v-row class="ml-4">
          <v-col class="d-flex justify-center">
            <TradeGraph
              v-if="graph_key && page_state != 2"
              :width="graphWidth"
              :height="graphHeight"
              :key_g="graph_key"
            ></TradeGraph>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <TableTrades
              v-if="trade_filter && page_state == 0"
              :prices="prices"
              :filter="trade_filter"
            ></TableTrades>
            <TableASession
              v-if="as_filter && page_state == 1"
              :prices="prices"
              :filter="as_filter"
              title="table_position"
              ref="a_session"
            ></TableASession>
          </v-col>
        </v-row>
      </v-col>
      <v-col :lg="4" :md="6">
        <SpotCard
          v-if="page_state == 0"
          :currency="curr_code"
          :price="price"
        ></SpotCard>
        <TableAC
          v-if="page_state == 1"
          :currency="curr_code ? curr_code : undefined"
          :prices="arb_data"
          :current="current"
          @reload="reload"
        ></TableAC>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Indicators from "~/components/elements/currencies/Indicators";
import TradeGraph from "~/components/graphs/Trade";
import TableTrades from "~/components/data/TableTrades";
import TableAC from "~/components/data/TableAC";
import TableASession from "~/components/data/TableASession";
import SpotCard from "~/components/elements/currencies/SpotCard";
import Platforms from "~/components/elements/currencies/Platforms";
import Leverage from "~/components/elements/Leverage";
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
      graphWidth: parseInt(((window.innerWidth - 350) * 2) / 3),
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
      str_subscr: "",
      curr_subscr: "",
      trade_filter: null,
      interv: null,
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
        return kk + ":" + this.curr_code;
      }
    },
  },
  watch: {
    curr_id() {
      this.trade_filter = {
        trade_status_id: "3",
        dest_currency_id: this.curr_id,
      };
      this.current = this.curr_by_id(this.curr_id) || {};
      this.curr_code = this.current.symbol;
    },
    curr_code() {
      this.as_filter = {
        "wallet[currency_id]": this.curr_id,
      };
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
        let socket = global.socket;
        socket.send(`{
          "method": "unsubscribe",
          "data": [${this.str_subscr}]
        }`);
      }
    },
    selected_platform() {
      this.arbitrage_sockets();
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
    async reload() {
      await this.$refs.a_session.reload();
    },
    onResize(event) {
      this.graphWidth = parseInt(((window.innerWidth - 250) * 2) / 3);
    },
    initGrpaphWidth() {},
    platform_changed(platform) {
      this.selected_platform = platform;
    },
    trades_subscribe_definer() {
      let me = this;
      let str = "";
      let arr = [];
      this.trades.forEach((wall, i) => {
        let p_arr = ["dest_currency", "source_currency"];
        for (let i = 0; i < 2; i++) {
          let curr = wall[p_arr[i]];
          let cr = curr.symbol;
          if (curr.currency_type.key == "CRYPTO") {
            let st = `${me.base_p}_${cr}-USD@ticker_10s`;
            let fnd = arr.find((el) => el == st);
            if (!fnd) {
              str += `"${st}"`;
              arr.push(st);
              str += ",";
            }
          } else {
            let ex_t = curr.exchange_type.key;
            if (cr != "USD") {
              let st = `shares_${cr}.${ex_t}@kline_1d`;
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
            me.low = data.low;
            me.high = data.high;
          }
        } else {
          if (data.low) {
            me.low = Math.round(1000 * data.low) / 1000;
            me.high = Math.round(1000 * data.high) / 1000;
          } else {
            me.price = data.price;
            me.change = data.change;
          }
        }
      }
    },
    spot_sockets() {
      let me = this;
      let socket = global.socket;
      let obj = me.trades_subscribe_definer();
      socket.send(`{
        "method": "unsubscribe",
        "data": [${me.str_subscr}]
      }`);
      me.str_subscr = obj.str;
      if (this.curr_crypto) {
        me.str_subscr += `"${me.base_p}_${me.curr_code}-USD@ticker_5s", `;
        obj.arr.push(`${me.base_p}_${me.curr_code}-USD@ticker_5s`);
        me.str_subscr += `"${me.base_p}_${me.curr_code}-USD@kline_1d"`;
        obj.arr.push(`${me.base_p}_${me.curr_code}-USD@kline_1d`);
      } else {
        me.ex_type = me.current.exchange_type.key;
        me.str_subscr += `"shares_${me.curr_code}.${me.ex_type}@kline_1d"`;
        obj.arr.push(`shares_${me.curr_code}.${me.ex_type}@kline_1d`);
      }
      socket.send(`{
        "method": "subscribe",
        "data": [${me.str_subscr}]
      }`);

      console.log("me.str_subscr", me.str_subscr);

      socket.onmessage = function (event) {
        if (event.data) {
          let json_d = JSON.parse(event.data);
          obj.arr.forEach((el) => {
            if (json_d && json_d.method == el) {
              let data = json_d.data ? json_d.data.data || [] : [];
              if (data.length > 0) {
                me.price_update(data[0]);
              }
            }
          });
        }
      };
    },
    arbitrage_sockets() {
      let me = this;
      let socket = global.socket;
      socket.send(`{
        "method": "unsubscribe",
        "data": [${me.str_subscr}]
      }`);
      me.str_subscr = `"all_${me.curr_code}-USD@ticker_5s"`;
      socket.send(`{
        "method": "subscribe",
        "data": [${me.str_subscr}]
      }`);

      socket.onmessage = function (event) {
        if (event.data) {
          let json_d = JSON.parse(event.data);
          if (json_d && json_d.method == `all_${me.curr_code}-USD@ticker_5s`) {
            let data = json_d.data ? json_d.data.data || [] : [];
            me.arb_data = data;
            me.prices = data;
          }
        }
      };
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
    let socket = global.socket;
    socket.send(`{
      "method": "unsubscribe",
      "data": [${this.str_subscr}]
    }`);
    if (this.interv) {
      clearInterval(this.interv);
    }
  },
};
</script>
<style scoped>
.crypto-select {
  width: 160px;
}
</style>
