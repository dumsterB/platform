<template>
  <div>
    <h3 class="ml-4 mb-2">Spot</h3>
    <v-card class="ma-2 mr-8 pa-4 pt-0 elevation-4 spot-card">
      <v-list-item-group class="d-flex">
        <v-list-item
          tagh="button"
          block
          class="justify-center text-uppercase icon_color--text"
          :class="!buy_sell ? '' : 'green_gradi'"
          :style="!buy_sell ? '' : customStyle"
          style="background: transparent"
          elevation="0"
          @click="buy_sell = true"
        >
          {{ $t("buy") }}
        </v-list-item>
        <v-list-item
          tagh="button"
          block
          elevation="0"
          class="justify-center text-uppercase icon_color--text"
          :class="!buy_sell ? 'red_gradi' : ''"
          :style="!buy_sell ? customStyle : ''"
          style="background: transparent"
          @click="buy_sell = false"
        >
          {{ $t("sell") }}
        </v-list-item>
      </v-list-item-group>
      <v-row>
        <v-col :cols="6" class="pb-0">
          <span class="small_text">{{ $t("available_balance_title") }}</span>
        </v-col>
        <v-col :cols="6" class="pb-0 text-right">
          <span class="small_text"
            >{{
              av_bal ? new Intl.NumberFormat().format(av_bal.toFixed(4)) : ""
            }}
            {{ curr }}</span
          >
        </v-col>
      </v-row>
      <v-row>
        <v-col :cols="12" class="pb-0">
          <span class="small_text">{{ $t("price") }}</span>
          <v-text-field
            v-model="price"
            outlined
            dense
            hide-details
            readonly
            class="mt-2 border-rad"
            suffix="USD"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col :cols="12" class="pb-0">
          <span class="small_text">{{ $t("amount") }}</span>
          <v-text-field
            v-model="amount"
            outlined
            dense
            hide-details
            :suffix="currency"
            class="mt-2"
            type="number"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col :cols="12" class="pb-0">
          <v-slider
            hide-details
            max="100"
            min="0"
            v-model="slider_v"
          ></v-slider>
        </v-col>
      </v-row>
      <v-row>
        <v-col :cols="6" class="pb-2 pt-0">
          <span class="small_text gray--text">0%</span>
        </v-col>
        <v-col :cols="6" class="pb-2 pt-0 text-right">
          <span class="small_text gray--text">100%</span>
        </v-col>
      </v-row>
      <v-row>
        <v-col :cols="12">
          <span>
            <span class="small_text">{{ $t("total") }}</span>
            <v-text-field
              v-model="t_price"
              outlined
              dense
              hide-details
              suffix="USD"
              type="number"
              class="mt-2"
            ></v-text-field>
          </span>
        </v-col>
      </v-row>
      <v-row>
        <v-col :cols="12" class="my-2">
          <v-btn
            large
            :loading="loading"
            :disabled="!amount"
            block
            class="rounded-xl"
            @click="trade_run"
            :style="customStyle"
            :class="buy_sell ? 'green_btn' : 'red_btn'"
            >{{ loading ? "" : buy_sell ? $t("buy") : $t("sell") }}</v-btn
          >
        </v-col>
      </v-row>
      <v-divider class="mt-4 mb-4"></v-divider>
      <v-row>
        <v-col>
          <v-btn
            block
            large
            class="success-btn"
            :style="customStyle"
            outlined
            @click="depositChanger('deposit_title')"
            >{{ $t("deposit_title") }}</v-btn
          >
        </v-col>
        <v-col>
          <v-btn
            block
            large
            outlined
            class="outlined-btn"
            :style="customStyle"
            @click="depositChanger('withdraw')"
            >{{ $t("withdraw") }}</v-btn
          >
        </v-col>
      </v-row>
      <v-row class="to_small_text">
        <v-col :cols="6" class="pb-0">
          <span class="gray--text">{{ "USD" }}</span>
          <span class="ml-4 gray--text">{{ $t("Available") }}</span>
        </v-col>
        <v-col :cols="6" class="pb-0 text-right">
          <span class=""
            >{{
              usd_bal ? new Intl.NumberFormat().format(usd_bal.toFixed(4)) : ""
            }}
            <span class="gray--text">{{ "USD" }}</span></span
          >
        </v-col>
      </v-row>
      <v-row class="mb-2 to_small_text">
        <v-col :cols="6">
          <span class="gray--text">{{ currency }}</span>
          <span class="ml-4 gray--text">{{ $t("Available") }}</span>
        </v-col>
        <v-col :cols="6" class="text-right">
          <span class=""
            >{{
              curr_bal
                ? new Intl.NumberFormat().format(curr_bal.toFixed(4))
                : ""
            }}
            <span class="gray--text">{{ currency }}</span></span
          >
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
import config from "~/config/config.json";

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
      start_blue_gradient: config.colors.start_blue_gradient,
      end_blue_gradient: config.colors.end_blue_gradient,
      start_red_gradient: config.colors.start_red_gradient,
      end_red_gradient: config.colors.end_red_gradient,
      primary: config.colors.text.primary,
    };
  },
  computed: {
    ...mapGetters("data/wallet", {
      wallet: "list",
    }),
    ...mapGetters("data/currency", {
      currencies: "list",
    }),
    usd_bal() {
      let bal = this.wallet.find((el) => el.currency.symbol == "USD");
      if (bal) {
        return bal.balance;
      }
      return 0;
    },
    curr_bal() {
      let bal = this.wallet.find((el) => el.currency.symbol == this.currency);
      if (bal) {
        return bal.balance;
      }
      return 0;
    },
    av_bal() {
      if (this.buy_sell) {
        return this.usd_bal;
      } else {
        return this.curr_bal;
      }
    },
    curr() {
      if (this.buy_sell) {
        return "USD";
      } else {
        return this.currency;
      }
    },
    customStyle() {
      return {
        "--start_blue_gradient": this.start_blue_gradient,
        "--end_blue_gradient": this.end_blue_gradient,
        "--start_red_gradient": this.start_red_gradient,
        "--end_red_gradient": this.end_red_gradient,
        "--primary": this.primary,
      };
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
      let pay = this.buy_sell ? this.t_price : this.amount;
      let buy = this.buy_sell ? this.amount : this.t_price;
      if (!this.buy_sell) buy = parseFloat(this.t_price) * this.price;
      // console.log(pay, buy, this.t_price, this.price);
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
      // console.log("trade_data", trade_data);
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
        }, 2500);
      }
      this.$store.commit("data/notifications/create", {
        id: color + "_" + Math.random().toString(36),
        title: title,
        text: title,
        color: color,
        timeout: 2000,
      });
      await this.fetchWallet();
      this.$emit("reload");
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
.small_text {
  font-size: 14px;
}
.to_small_text {
  font-size: 13px;
}
.green_gradi {
  background: linear-gradient(
    163.28deg,
    var(--start_blue_gradient) 0%,
    var(--end_blue_gradient) 85.7%
  ) !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  background-clip: text !important;
  text-fill-color: transparent !important;
  position: relative !important;
}
.green_gradi:after {
  position: absolute;
  content: "";
  width: 100%;
  min-height: 6px !important;
  top: -0px;
  left: 0;
  background: linear-gradient(
    163.28deg,
    var(--start_blue_gradient) 0%,
    var(--end_blue_gradient) 85.7%
  ) !important;
  border-radius: 0px 0px 4px 4px;
}
.red_gradi {
  background: linear-gradient(
    176.35deg,
    var(--start_red_gradient) 0.47%,
    var(--end_red_gradient) 97%
  ) !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  background-clip: text !important;
  text-fill-color: transparent !important;
  position: relative !important;
}
.red_gradi::after {
  position: absolute;
  content: "";
  width: 100%;
  min-height: 6px !important;
  top: -0px;
  left: 0;
  background: linear-gradient(
    176.35deg,
    var(--start_red_gradient) 0.47%,
    var(--end_red_gradient) 97%
  ) !important;
  border-radius: 0px 0px 4px 4px;
}
.green_btn {
  background: linear-gradient(
    163.28deg,
    var(--start_blue_gradient) 0%,
    var(--end_blue_gradient) 85.7%
  );
  color: white !important;
  border-radius: 16px !important;
}
.red_btn {
  background: linear-gradient(
    163.28deg,
    var(--start_red_gradient) 0%,
    var(--end_red_gradient) 85.7%
  );
  color: white !important;
  border-radius: 16px !important;
}
.outlined-btn {
  background: transparent !important;
  border: solid 2px var(--primary) !important;
  color: var(--primary);
  border-radius: 16px;
}
.success-btn {
  background: var(--primary) !important;
  border: solid 2px var(--primary) !important;
  color: white !important;
  border-radius: 16px;
}
</style>
