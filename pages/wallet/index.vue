<template>
  <div class="wallet">
    <v-row>
      <v-col lg="4" xl="3">
        <div class="">
          <h2>{{ $t("my_cards") }}</h2>
          <GeneralCapital
            class="mt-5"
            :total_sum_btc="total_sum"
            :total_sum="total_sum_usdt"
          ></GeneralCapital>
          <br />
          <h2>{{ $t("spot_account") }}</h2>
          <Check
            class="mt-5"
            :title="spot_title"
            :totalEquity="spot_total_equity"
            :total_equity_usdt="spot_total_equity_usdt"
            :available_balance="spot_available_balance"
            :available_balance_usdt="spot_available_balance_usdt"
            :main_currency="true"
            @history="spot_history"
          ></Check>
          <br />
          <h2>{{ $t("fiat_account") }}</h2>
          <Check
            class="mt-5"
            :title="fiat_title"
            :totalEquity="fiat_total_equity"
            :total_equity_usdt="fiat_total_equity_usdt"
            :available_balance="fiat_available_balance"
            :available_balance_usdt="fiat_available_balance_usdt"
            :main_currency="false"
            @history="fiat_history"
          >
          </Check>
        </div>
      </v-col>
      <v-col lg="8" xl="9" class="mt-0 pt-0">
        <div>
          <TableTransactions
            v-if="!is_history"
            :wallets="wallets_t"
            @reload="init_tb"
          ></TableTransactions>
          <TableOrders
            v-if="is_history"
            :filter="order_filter"
            class="ma-0"
          ></TableOrders>
          <TableTrades
            v-if="is_history"
            :prices="prices"
            :filter="trade_filter"
            title="recent_trades"
            class="customSizes"
          ></TableTrades>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import GeneralCapital from "@/components/elements/GeneralCapital";
import Check from "@/components/elements/Check";
import TableTransactions from "@/components/data/TableWallets";
import TableTrades from "@/components/data/TableTrades";
import TableOrders from "@/components/data/TableOrders";

export default {
  components: {
    GeneralCapital,
    Check,
    TableTransactions,
    TableTrades,
    TableOrders,
  },
  mounted() {},
  data() {
    return {
      spot_total_equity: "0",
      spot_available_balance: "0",
      spot_available_balance_usdt: "0",
      spot_total_equity_usdt: "0",
      fiat_total_equity: "0",
      fiat_available_balance: "0",
      fiat_available_balance_usdt: "0",
      fiat_total_equity_usdt: "0",
      total_sum: "0",
      total_sum_usdt: "0",
      wallets_t: [],
      prices: [],
      base_p: this.$store.state.config.data.base_p,
      is_history: false,
      is_spot_order: false,
      is_fiat_order: false,
      order_filter: null,
      trade_filter: {
        trade_status_id: "3",
      },
      interv: null,
    };
  },
  computed: {
    ...mapGetters("data/wallet", {
      wallets: "list",
    }),
    ...mapGetters("config/ws", {
      prices_current: "page_data",
    }),
    ...mapGetters("config/default", {
      get_val: "get_val",
    }),
    spot_title() {
      return this.$t("spot_account");
    },
    fiat_title() {
      return this.$t("fiat_account");
    },
  },
  methods: {
    ...mapActions("data/wallet", {
      fetchWallet: "fetchList",
    }),
    ...mapActions("data/trade", {
      fetchTrades: "fetchList",
    }),
    ...mapActions("data/order", {
      fetchOrders: "fetchList",
    }),
    ...mapMutations("config/ws", {
      unsubscribe: "unsubscribe_page",
      subscribe: "set_page_subscribe",
    }),
    check_tbls() {
      // if (this.is_spot_order && !this.is_fiat_order) {
      //   this.order_filter = {
      //     "dest_currency[currency_type_id]": "1",
      //   };
      // } else if (!this.is_spot_order && this.is_fiat_order) {
      //   this.order_filter = {
      //     "dest_currency[currency_type_id]": "2,3",
      //   };
      // } else {
      //   this.order_filter = null;
      // }
      // console.log("this.order_filter", this.order_filter);
      this.is_history = this.is_spot_order || this.is_fiat_order;
    },
    spot_history(tg) {
      this.is_spot_order = tg;
      this.check_tbls();
    },
    fiat_history(tg) {
      this.is_fiat_order = tg;
      this.check_tbls();
    },
    init_tb() {
      let me = this;
      let data = this.prices;
      if (data) {
        me.wallets_t = me.wallets.map((el) => {
          let fnd = data.find((dt) => dt && dt.base == el.currency.symbol);
          if (fnd && fnd.price) {
            let eqv = parseFloat(fnd.price) * el.balance;
            el.eqv = eqv.toFixed(3);
          } else {
            el.eqv = el.balance;
          }
          return el;
        });
        let sum_t = 0;
        let sum_spot = 0;
        let sum_fiat = 0;
        me.wallets_t.forEach((element) => {
          sum_t += parseFloat(element.eqv);
          if (
            element.currency &&
            element.currency.currency_type &&
            element.currency.currency_type.key == "CRYPTO"
          ) {
            sum_spot += parseFloat(element.eqv);
          }
          if (
            element.currency &&
            element.currency.currency_type &&
            element.currency.currency_type.key == "FIAT"
          ) {
            sum_fiat += parseFloat(element.eqv);
          }
        });
        me.total_sum_usdt = sum_t.toFixed(4);
        me.spot_available_balance_usdt = sum_spot.toFixed(4);
        me.fiat_available_balance_usdt = sum_fiat.toFixed(4);
        me.spot_total_equity_usdt = me.spot_available_balance_usdt;
        me.fiat_total_equity_usdt = me.fiat_available_balance_usdt;
        let fnd_btc = data.find((el) => el && el.base == "BTC");
        if (fnd_btc) {
          me.total_sum = (sum_t / parseFloat(fnd_btc.price)).toFixed(4);
          me.spot_available_balance = (
            sum_spot / parseFloat(fnd_btc.price)
          ).toFixed(4);
          me.fiat_available_balance = (
            sum_fiat / parseFloat(fnd_btc.price)
          ).toFixed(4);
          me.spot_total_equity = me.spot_available_balance;
          me.fiat_total_equity = me.fiat_available_balance;
        }
        // console.log("sums", sum_t, sum_spot, sum_fiat);
      }
    },
    wallets_subscribe_definer() {
      let me = this;
      let str = "";
      let arr = [];
      this.wallets.forEach((wall, i) => {
        let cr = wall.currency.symbol;
        let dt = me.get_val(cr);
        if (dt) {
          me.price_update(dt);
        }
        if (wall.currency.currency_type.key == "CRYPTO") {
          str += `"${me.base_p}:${cr}-USD@ticker_10s"`;
          arr.push(`${me.base_p}:${cr}-USD@ticker_10s`);
          if (i < this.wallets.length - 1) {
            str += ",";
          }
        } else {
          let ex_t = wall.currency.exchange_type.key;
          if (cr != "USD") {
            str += `"shares:${cr}.${ex_t}@kline_1d"`;
            arr.push(`shares:${cr}.${ex_t}@kline_1d`);
            if (i < this.wallets.length - 1) {
              str += ",";
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
      let add_data = {
        price: data.close ? 1 / data.close : data.price,
        base: data.base ? data.base : data.share,
      };
      let fnd = this.prices.find((el) => el && el.base == add_data.base);
      if (fnd) {
        fnd.price = add_data.price;
      } else {
        this.prices.push(add_data);
      }
    },
    async init() {
      let me = this;
      let obj = me.wallets_subscribe_definer();
      let btc_sub = `${me.base_p}:BTC-USD@ticker_10s`;
      let finder = obj.arr.find((el) => el == btc_sub);
      let arr = Object.assign([], obj.arr);
      if (!finder) {
        arr.unshift(btc_sub);
      }
      this.subscribe(arr);
    },
  },
  watch: {
    prices() {
      this.init_tb();
    },
    prices_current(v) {
      let json_d = Object.assign({}, v);
      let me = this;
      let data = json_d.data ? json_d.data.data || [] : [];
      if (data.length > 0) {
        me.price_update(data[0]);
      }
    },
  },
  async created() {
    await this.init();
    this.prices = Object.assign([], this.prices);
    this.interv = setInterval(() => {
      this.prices = Object.assign([], this.prices);
    }, 8000);
  },
  destroyed() {
    this.unsubscribe();
    if (this.interv) {
      clearInterval(this.interv);
    }
  },
};
</script>
<style lang="scss">
.customSizes {
  margin: -4px;
}
</style>
