<template>
  <div>
    <v-row class="pa-3 pl-6 pr-6"
      ><v-col>
        <!-- <v-row
          ><v-col>
            <v-row class="pl-4 mb-2">
              <v-img class="mr-4" max-width="50" :src="currency.logo"></v-img>
              <span class="mt-3">{{ currency.symbol }}</span></v-row
            >
          </v-col></v-row
        > -->
        <v-row>
          <v-col
            cols="12"
            xl="3"
            md="6"
            lg="4"
            sm="12"
            v-for="(cmp, i) in arb_companies"
            :key="i"
            ><TradeCreditPosition
              :tradeItem="cmp.currency"
              :action="cmp.action"
              :userWallet="cmp.wallet"
              :tradePlatform="cmp.company"
              :price="cmp.price"
              :height="530"
              @reload="reload"
          /></v-col> </v-row></v-col
    ></v-row>
    <div v-if="isLoading" class="loader-leverage">
      <v-progress-circular
        :size="50"
        :width="5"
        color="primary"
        indeterminate
      ></v-progress-circular>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import TradeCreditPosition from "../../components/elements/modals/CreditTradePosition";

const modelCompanies = "data/arbitrage_company";
const wallet = "data/wallet";
export default {
  name: "Arbitage",
  props: {
    currency: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  components: {
    TradeCreditPosition,
  },
  data() {
    return {
      dialog: false,
      arb_companies: [],
      prices_all: [],
      cur_len: 8,
      prices: [],
      need_curr: null,
      isLoading: true,
      base_p: this.$store.state.config.data.base_p,
      as_mode_active: 0,
    };
  },
  watch: {
    dialog() {
      if (!this.dialog) {
        this.selectedCurrency = {};
        this.userWallet = {};
        this.selectedArbitrageCompany = {};
      }
    },
    currency(v) {
      this.update_subscr(v);
    },
    prices_current(v) {
      let me = this;
      let json_d = Object.assign({}, v);
      if (me.need_curr) {
        let curr = me.need_curr.symbol;
        if (json_d && json_d.method == `all:${curr}-USD@ticker_5s`) {
          me.isLoading = false;
          let data = json_d.data ? json_d.data.data || [] : [];
          me.define_arb_companies(data);
          me.define_prices(data);
        }
      }
    },
  },
  methods: {
    ...mapActions(wallet, {
      fetchWallet: "fetchList",
    }),
    ...mapActions("data/arbitrage_session", {
      fetchAS: "fetchList",
    }),
    ...mapActions(modelCompanies, {
      fetchList: "fetchList",
    }),
    ...mapMutations("config/ws", {
      unsubscribe: "unsubscribe_page",
      subscribe: "set_page_subscribe",
      add_subscribe: "add_page_subscribe",
      del_subscribe: "del_page_subscribe",
    }),
    update_subscr(curr) {
      let me = this;
      if (this.need_curr) {
        me.del_subscribe(`all:${this.need_curr.symbol}-USD@ticker_5s`);
      }
      this.need_curr = curr;
      setTimeout(() => {
        me.add_subscribe(`all:${curr.symbol}-USD@ticker_5s`);
      }, 100);
    },
    define_prices(data) {
      let me = this;
      let dt = Object.assign([], me.prices_all);
      data.forEach((element) => {
        if (element) {
          let fnd = dt.findIndex(
            (el) =>
              el && el.base == element.base && el.company == element.company
          );
          if (fnd < 0) {
            dt.push(element);
          } else {
            dt[fnd] = element;
          }
        }
      });
      me.prices_all = dt;
    },
    define_arb_companies(data) {
      let me = this;
      let arb_companies = [];
      data.forEach((element) => {
        if (element && element.price) {
          let comp = me.ac.find((el) => el.name == element.company);
          if (comp) {
            let wallet = me.wallet_full.find(
              (el) => el.currency_id == me.currency.id
            );
            arb_companies.push({
              currency: me.currency,
              wallet: wallet || {},
              company: comp,
              action: wallet ? "Both" : "Buy",
              price: element.price,
            });
          }
        }
      });
      me.arb_companies = arb_companies;
      // console.log("me.arb_companies", me.arb_companies);
    },
    async reload() {
      await this.$refs.a_session.reload();
    },
  },
  computed: {
    ...mapGetters("data/wallet", {
      wallet_full: "list",
    }),
    ...mapGetters("data/currency", {
      currencies: "list",
    }),
    ...mapGetters("config/ws", {
      prices_current: "page_data",
    }),
    currs() {
      let res = [];
      let wlts = this.wallet_full.filter((el) => el.currency.symbol != "USD");
      let crs = wlts.map((el) => {
        el.currency.wallet_id = el.id;
        return el.currency;
      });
      if (crs.length > this.cur_len) {
        res = crs.slice(0, this.cur_len);
      } else {
        res = crs;
        for (let i = crs.length; i < this.cur_len; i++) {
          let cr = this.currencies.find((el) => {
            if (el.currency_type.key == "CRYPTO") {
              let f = res.find((e) => e.id == el.id);
              if (!f) return true;
            }
            return false;
          });
          res.push(cr);
        }
      }
      res.forEach((el) => {
        let fnd = this.prices_all.find((e) => e.base == el.symbol);
        if (fnd && fnd.price) el.price = fnd.price;
      });
      return res;
    },
    ...mapGetters(modelCompanies, {
      ac: "list",
    }),
    ...mapGetters("data/arbitrage_company", {
      arbitrage_company: "list",
    }),
  },
  async created() {
  },
  destroyed() {
    this.unsubscribe();
  },
};
</script>

<style>
.op_t_title {
  font-size: 22px;
}
.loader-leverage {
  padding-top: 50px;
  padding-bottom: 50px;
  text-align: center;
}
</style>
