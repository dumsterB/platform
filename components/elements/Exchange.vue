<template>
  <div class="ma-4">
    <div class="d-flex mdc-form-field--space-between">
      <p class="text-h6">{{ $t("exchange") }}</p>
    </div>
    <v-card class="pa-3" elevation="4">
      <div class="justify-center text-center">
        <div class="pa-1 mt-2 justify-space-between d-flex">
          <v-text-field
            v-model="buy"
            label="0"
            class="mr-2"
            solo
            hide-details
            type="number"
          ></v-text-field>
          <v-autocomplete
            v-model="buy_curr"
            :items="currencies"
            label=""
            class="ml-2"
            item-text="name"
            item-value="symbol"
            solo
            hide-details
          >
            <template v-slot:item="{ item }">
              <img height="20" width="20" :src="item.logo" />
              <p class="ml-4 mt-3">{{ item.name }}</p>
            </template>
          </v-autocomplete>
        </div>
        <div class="pa-1 mt-2 mb-4 justify-space-between d-flex">
          <v-text-field
            v-model="pay"
            :label="$t('pay_with')"
            class="mr-2"
            solo
            hide-details
            type="number"
          ></v-text-field>
          <v-autocomplete
            v-model="pay_curr"
            :items="available_currs"
            label=""
            class="ml-2"
            item-text="name"
            item-value="symbol"
            solo
            hide-details
          >
            <template v-slot:item="{ item }">
              <img height="20" width="20" :src="item.logo" />
              <p class="ml-4 mt-3">{{ item.name }}</p>
            </template>
          </v-autocomplete>
        </div>
        <v-btn
          block
          large
          class="success-btn mb-3"
          :style="customStyle"
          elevation="0"
          @click="trade_run"
          :loading="loading"
          :disabled="!pay"
          >{{ $t("trade") }}</v-btn
        >
      </div>
    </v-card>
    <v-row class="mt-10 d-flex align-center justify-start">
      <v-col :cols="8">
        <v-text-field
          v-model="link_url"
          :label="$t('for_depositing_Bitcoin')"
          readonly
          outlined
          dense
          hide-details
          disabled
          ref="clone"
        ></v-text-field>
      </v-col>
      <v-col :cols="3">
        <v-icon
          :color="copied ? 'green' : ''"
          large
          @click.prevent.stop="copyURL(link_url)"
          >{{ copied ? "mdi-check" : "mdi-content-copy" }}</v-icon
        >
      </v-col>
    </v-row>
    <br />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import config from "~/config/config.json";
const currencies = "data/currency";
export default {
  name: "Exchange",
  props: {
    currency: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      start_gradient: config.themes.dark.start_gradient,
      end_gradient: config.themes.dark.end_gradient,
      link_url: "bc1qu75kr9s9j0hpuf5qugqdastwwhzglz3gfwcz06",
      copied: false,
      pay: null,
      buy: null,
      pay_curr: "USD",
      buy_curr: "BTC",
      buy_checker: false,
      pay_checker: false,
      loading: false,
      ex_rate: 1,
    };
  },
  methods: {
    ...mapActions(currencies, {
      fetchCurrencies: "fetchList",
    }),
    ...mapActions("data/trade", {
      trade_create: "create",
      fetchTrades: "fetchList",
    }),
    ...mapActions("data/wallet", {
      fWallets: "fetchList",
    }),
    async copyURL() {
      try {
        //*TODO - документация обещает, что navigator.clipboard будет работать при https соеденении. Иначе нужен иной способ
        // await navigator.clipboard.writeText(this.link_url);
        this.copied = true;
        setTimeout(() => {
          this.copied = false;
        }, 1500);
      } catch (e) {
        console.log(e);
      }
    },
    async trade_run() {
      this.loading = true;
      let trade_data = {};
      let wall = this.wallets.find((el) => el.currency.symbol == this.pay_curr);
      if (wall) {
        trade_data.wallet_id = wall.id;
        trade_data.source_currency_id = wall.currency_id;
        trade_data.source_amount = parseFloat(this.pay);
      }
      let curr = this.currencies.find((el) => el.symbol == this.buy_curr);
      if (curr) {
        trade_data.dest_currency_id = curr.id;
        trade_data.dest_amount = parseFloat(this.buy);
      }
      trade_data.exchange_rate = this.ex_rate;
      console.log("trade_data", trade_data);
      let rs = await this.trade_create({ data: trade_data });
      let title, color;
      if (rs.data && rs.data.trade_status_id != 3) {
        title = this.$t("not_enough_balance");
        color = "error";
      } else {
        title = this.$t("create_order_progress");
        color = "warning";
        setTimeout(() => {
          this.$store.commit("data/notifications/create", {
            id: color + "_" + Math.random().toString(36),
            title: this.$t("create_trade"),
            text: this.$t("create_trade"),
            color: "primary",
          });
        }, 2000);
      }
      this.$store.commit("data/notifications/create", {
        id: color + "_" + Math.random().toString(36),
        title: title,
        text: title,
        color: color,
      });
      await this.fWallets();
      this.$emit("reload");
      this.loading = false;
    },
  },
  watch: {
    pay() {
      if (this.pay_checker) {
        this.pay_checker = false;
      } else {
        let fl_p = parseFloat(this.pay);
        let pp = this.currency.find((el) => el.symbol == this.pay_curr);
        let pp_n = pp && pp.price ? parseFloat(pp.price) : 1;
        let bb = this.currency.find((el) => el.symbol == this.buy_curr);
        let bb_n = bb && bb.price ? parseFloat(bb.price) : 1;
        this.ex_rate = pp_n / bb_n;
        let sum = (fl_p * pp_n) / bb_n;
        this.buy_checker = true;
        this.buy = sum;
      }
    },
    buy() {
      if (this.buy_checker) {
        this.buy_checker = false;
      } else {
        let fl_p = parseFloat(this.buy);
        let pp = this.currency.find((el) => el.symbol == this.pay_curr);
        let pp_n = pp && pp.price ? parseFloat(pp.price) : 1;
        let bb = this.currency.find((el) => el.symbol == this.buy_curr);
        let bb_n = bb && bb.price ? parseFloat(bb.price) : 1;
        this.ex_rate = pp_n / bb_n;
        let sum = (fl_p * bb_n) / pp_n;
        this.pay_checker = true;
        this.pay = sum;
      }
    },
    pay_curr() {
      let fl_p = parseFloat(this.buy);
      let pp = this.currency.find((el) => el.symbol == this.pay_curr);
      let pp_n = pp && pp.price ? parseFloat(pp.price) : 1;
      let bb = this.currency.find((el) => el.symbol == this.buy_curr);
      let bb_n = bb && bb.price ? parseFloat(bb.price) : 1;
      this.ex_rate = pp_n / bb_n;
      let sum = (fl_p * bb_n) / pp_n;
      this.pay_checker = true;
      this.pay = sum;
    },
    buy_curr() {
      let fl_p = parseFloat(this.pay);
      let pp = this.currency.find((el) => el.symbol == this.pay_curr);
      let pp_n = pp && pp.price ? parseFloat(pp.price) : 1;
      let bb = this.currency.find((el) => el.symbol == this.buy_curr);
      let bb_n = bb && bb.price ? parseFloat(bb.price) : 1;
      this.ex_rate = pp_n / bb_n;
      let sum = (fl_p * pp_n) / bb_n;
      this.buy_checker = true;
      this.buy = sum;
    },
  },
  computed: {
    ...mapGetters(currencies, {
      currencies: "list",
    }),
    customStyle() {
      return {
        "--start_gradient": this.start_gradient,
        "--end_gradient": this.end_gradient,
      };
    },
    ...mapGetters("data/wallet", {
      wallets: "list",
    }),
    ...mapGetters("data/trade", {
      trades: "list",
    }),
    available_currs() {
      return this.wallets.map((el) => el.currency);
    },
  },
};
</script>

<style scoped>
.success-btn {
  background: linear-gradient(
    94.9deg,
    var(--start_gradient) 4.26%,
    var(--end_gradient) 95.87%
  );
  color: white !important;
}
</style>
