<template>
  <div>
    <v-card class="ma-2 mr-8 pa-4">
      <v-row>
        <v-col :cols="6">
          <v-btn
            large
            block
            :class="!buy_sell ? 'green--text' : 'green'"
            :outlined="buy_sell"
            dark
            elevation="0"
            @click="buy_sell = true"
            >{{ $t("buy") }}</v-btn
          >
        </v-col>
        <v-col :cols="6">
          <v-btn
            large
            block
            elevation="0"
            :class="!buy_sell ? 'red' : 'red--text'"
            :outlined="!buy_sell"
            @click="buy_sell = false"
            >{{ $t("sell") }}</v-btn
          >
        </v-col>
      </v-row>
      <v-row>
        <v-col :cols="9">
          <span>{{ $t("available_balance_title") }}</span>
        </v-col>
        <v-col :cols="3">
          <span>{{ av_bal }} {{ curr }}</span>
        </v-col>
      </v-row>
      <v-row>
        <v-col :cols="6" class="mt-2">
          <span>{{ $t("price") }}</span>
        </v-col>
        <v-col :cols="6">
          <v-text-field
            v-model="price"
            outlined
            dense
            hide-details
            readonly
            suffix="USD"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col :cols="6" class="mt-2">
          <span>{{ $t("amount") }}</span>
        </v-col>
        <v-col :cols="6">
          <v-text-field
            v-model="amount"
            outlined
            dense
            hide-details
            :suffix="currency"
            type="number"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col :cols="12">
          <v-slider
            hide-details
            max="100"
            min="0"
            v-model="slider_v"
          ></v-slider>
        </v-col>
      </v-row>
      <v-row>
        <v-col :cols="6" class="mt-2">
          <span>{{ $t("total") }}</span>
        </v-col>
        <v-col :cols="6">
          <span>
            <v-text-field
              v-model="t_price"
              outlined
              dense
              hide-details
              suffix="USD"
              type="number"
            ></v-text-field>
          </span>
        </v-col>
      </v-row>
      <v-row>
        <v-col :cols="12">
          <v-btn
            :loading="loading"
            :disabled="!amount"
            large
            block
            @click="trade_run"
            :class="buy_sell ? 'green' : 'red'"
            >{{ buy_sell ? $t("buy") : $t("sell") }}</v-btn
          >
        </v-col>
      </v-row>
      <v-divider class="mt-4 mb-4"></v-divider>
      <v-row>
        <v-col :cols="6">
          <v-btn
            large
            block
            class="green--text"
            outlined
            @click="depositChanger('deposit_title')"
            >{{ $t("deposit_title") }}</v-btn
          >
        </v-col>
        <v-col :cols="6">
          <v-btn large block @click="depositChanger('withdraw')">{{
            $t("withdraw")
          }}</v-btn>
        </v-col>
      </v-row>
    </v-card>
    <Deposit
      :action="action"
      :dialog="dialog"
      @depositChanger="depositChanger"
    ></Deposit>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Deposit from "@/components/modals/Deposit";

export default {
  props: {
    currency: {
      type: String,
      default: "BTC",
    },
    price: 0,
  },
  components: {
    Deposit,
  },
  data() {
    return {
      t_price: null,
      amount: null,
      t_price_checker: true,
      amount_checker: true,
      lst_am: true,
      buy_sell: true,
      slider_v: "0",
      loading: false,
      action: null,
      dialog: false,
    };
  },
  computed: {
    ...mapGetters("data/wallet", {
      wallet: "list",
    }),
    ...mapGetters("data/currency", {
      currencies: "list",
    }),
    av_bal() {
      let usd_bal;
      if (this.buy_sell) {
        usd_bal = this.wallet.find((el) => el.currency.symbol == "USD");
      } else {
        usd_bal = this.wallet.find((el) => el.currency.symbol == this.currency);
      }
      if (usd_bal) {
        return usd_bal.balance;
      }
      return 0;
    },
    curr() {
      if (this.buy_sell) {
        return "USD";
      } else {
        return this.currency;
      }
    },
  },
  methods: {
    ...mapActions("data/wallet", {
      fetchWallet: "fetchList",
    }),
    ...mapActions("data/trade", {
      trade_create: "create",
      fetchTrades: "fetchList",
    }),
    depositChanger(val) {
      this.dialog = !this.dialog;
      this.action = val;
    },
    am_def() {
      if (this.amount) {
        let t_price;
        if (this.buy_sell) {
          t_price = parseFloat(this.price) * parseFloat(this.amount);
        } else {
          t_price = parseFloat(this.price) * parseFloat(this.amount);
        }
        this.t_price = t_price.toFixed(4);
      } else {
        this.t_price = null;
      }
    },
    am_def_price() {
      if (this.t_price) {
        let am;
        if (this.buy_sell) {
          am = parseFloat(this.t_price) / parseFloat(this.price);
        } else {
          am = parseFloat(this.t_price) / parseFloat(this.price);
        }
        this.amount = Math.round(am * 1000000) / 1000000;
      } else {
        this.amount = null;
      }
    },
    sl_def() {
      let v_n = parseFloat(this.slider_v);
      if (v_n) {
        let amount;
        if (this.buy_sell) {
          amount = (this.av_bal * v_n) / parseFloat(this.price) / 100;
        } else {
          amount = (this.av_bal * v_n) / 100;
        }
        this.amount = Math.round(amount * 1000000) / 1000000;
      }
    },
    async trade_run() {
      this.loading = true;
      let trade_data = {};
      let pay_curr = "USD";
      if (!this.buy_sell) pay_curr = this.currency;
      let buy_curr = this.currency;
      if (!this.buy_sell) buy_curr = "USD";
      let pay = this.t_price;
      let buy = this.amount;
      if (!this.buy_sell) buy = parseFloat(this.t_price) * this.price;
      console.log(pay, buy, this.t_price, this.price);
      let wall = this.wallet.find((el) => el.currency.symbol == pay_curr);
      if (wall) {
        trade_data.wallet_id = wall.id;
        trade_data.source_currency_id = wall.currency_id;
        trade_data.source_amount = parseFloat(pay);
      }
      let curr = this.currencies.find((el) => el.symbol == buy_curr);
      if (curr) {
        trade_data.dest_currency_id = curr.id;
        trade_data.dest_amount = parseFloat(buy);
      }
      trade_data.exchange_rate = 1 / this.price;
      if (!this.buy_sell) trade_data.exchange_rate = this.price;
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
            title: this.$t("create_order_done"),
            text: this.$t("create_order_done"),
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
      await this.fetchWallet();
      await this.fetchTrades();
      setTimeout(() => {
        this.loading = false;
      }, 500);
    },
  },
  watch: {
    amount() {
      if (this.amount_checker) {
        this.t_price_checker = false;
        this.am_def();
        this.lst_am = true;
      } else {
        this.amount_checker = true;
      }
    },
    t_price() {
      if (this.t_price_checker) {
        this.amount_checker = false;
        this.am_def_price();
        this.lst_am = false;
      } else {
        this.t_price_checker = true;
      }
    },
    slider_v() {
      this.sl_def();
    },
    price() {
      if (this.lst_am) {
        this.t_price_checker = false;
        this.am_def();
      } else {
        this.amount_checker = false;
        this.am_def_price();
      }
    },
  },
  created() {
    this.fetchWallet();
  },
};
</script>
<style lang="scss" scoped>
</style>
