<template v-slot:[`item.action`]="{ item }">
  <v-card class="ma-0 pa-0 card">
    <v-list-item-group class="d-flex list_group">
      <v-list-item
        tag="button"
        block
        class="justify-center text-uppercase icon_color--text ml-6 mr-6"
        :class="action == 'Sell' ? '' : 'green_gradi'"
        :style="customStyle"
        style="background: transparent"
        elevation="0"
        @click="action = 'Buy'"
      >
        {{ $t("buy") }}
      </v-list-item>
      <v-list-item
        tag="button"
        block
        elevation="0"
        class="justify-center text-uppercase icon_color--text ml-6 mr-6"
        :class="action === 'Sell' ? 'red_gradi' : ''"
        :style="customStyle"
        style="background: transparent"
        @click="action = 'Sell'"
      >
        {{ $t("sell") }}
      </v-list-item>
    </v-list-item-group>
    <v-card-title class="d-flex">
      <v-img
        contain
        tag="img"
        height="60px"
        :src="tradePlatform ? tradePlatform.logo : ''"
        :alt="tradePlatform ? tradePlatform.name : ''"
        class=""
      >
      </v-img>
    </v-card-title>
    <v-card-text class="pb-0 mb-0">
      <v-container class="d-flex justify-lg-space-between font-weight-medium">
        <span :style="customStyle" class="card_text">{{
          $t("marketplace_price")
        }}</span>
        <span :style="customStyle" class="card_text"
          >{{ new Intl.NumberFormat().format(price) }} USD</span
        >
      </v-container>
      <v-container class="d-flex justify-lg-space-between">
        <span :style="customStyle" class="card_text">{{
          `${$t("available_balance")}`
        }}</span>
        <span :style="customStyle" class="card_text">{{ balance }}</span>
      </v-container>
      <v-container>
        <v-text-field
          :label="action == 'Buy' ? $t('choose_amount') : $t('total')"
          v-model="amount_usd"
          outlined
          dense
          :readonly="action == 'Sell'"
          :suffix="action == 'Buy' ? `${price * amount_usd} USD` : 'USD'"
          hide-details
          type="number"
        ></v-text-field>
      </v-container>
      <v-container>
        <v-text-field
          :label="action == 'Buy' ? $t('total') : $t('choose_amount')"
          v-model="amount"
          outlined
          dense
          :readonly="action == 'Buy'"
          :suffix="
            action == 'Sell'
              ? `${price * amount} ${tradeItem.symbol}`
              : tradeItem.symbol
          "
          :error-messages="err_m"
          type="number"
        ></v-text-field>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-btn
        large
        :loading="loading"
        :disabled="!amount"
        block
        class="mainBorderRadius ma-0 mb-8"
        @click="save"
        :style="customStyle"
        :class="action !== 'Sell' ? 'green_btn' : 'red_btn'"
        >{{ loading ? "" : action !== "Sell" ? $t("buy") : $t("sell") }}</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import config from "~/config/config.json";
export default {
  name: "TradePosition",
  data() {
    return {
      start_blue_gradient: config.colors.start_blue_gradient,
      end_blue_gradient: config.colors.end_blue_gradient,
      start_red_gradient: config.colors.start_red_gradient,
      end_red_gradient: config.colors.end_red_gradient,
      white: config.colors.white,
      black: config.colors.black,
      amount: "",
      action: "Buy",
      am_ch: true,
      amusd_ch: true,
      amount_usd: "",
      wl: {},
      loading: false,
      loadingSell: false,
      err_m: null,
    };
  },
  props: {
    tradeItem: {
      type: Object,
      default: () => {
        return {};
      },
    },
    price: {
      default: null,
    },
    // action: {
    //   type: String,
    //   default: "",
    // },
    userWallet: {
      type: Object,
      default: () => {
        return {};
      },
    },
    tradePlatform: {
      type: Object,
      default: () => {
        return {};
      },
    },
    // height: {
    //   type: Number,
    //   default: 400,
    // },
  },
  computed: {
    ...mapGetters("data/arbitrage_session", {
      as: "list",
    }),
    ...mapGetters("data/wallet", {
      wallet: "list",
    }),
    balance() {
      if (this.action === "Sell") {
        if (this.userWallet.currency) {
          return (
            new Intl.NumberFormat().format(this.userWallet.balance) +
            " " +
            this.userWallet.currency.symbol
          );
        }
      } else {
        if (this.wl.currency) {
          return (
            new Intl.NumberFormat().format(this.wl.balance) +
            " " +
            this.wl.currency.symbol
          );
        }
      }
    },
    customStyle() {
      return {
        "--start_blue_gradient": this.start_blue_gradient,
        "--end_blue_gradient": this.end_blue_gradient,
        "--start_red_gradient": this.start_red_gradient,
        "--end_red_gradient": this.end_red_gradient,
        "--white": this.white,
        "--black": this.black,
      };
    },
  },
  watch: {
    action() {
      this.amount = null;
      this.amount_usd = null;
    },
    price() {
      if (this.action == "Buy") {
        this.am_ch = false;
        this.amount = parseFloat(this.amount_usd) / this.price;
      } else {
        this.amusd_ch = false;
        this.amount_usd = parseFloat(this.amount) * this.price;
      }
    },
    amount() {
      this.err_m = null;
      if (this.amount && this.am_ch) {
        this.amusd_ch = false;
        this.amount_usd = parseFloat(this.amount) * this.price;
      } else {
        this.am_ch = true;
      }
    },
    amount_usd() {
      this.err_m = null;
      if (this.amount_usd && this.amusd_ch) {
        this.am_ch = false;
        this.amount = parseFloat(this.amount_usd) / this.price;
      } else {
        this.amusd_ch = true;
      }
    },
  },
  methods: {
    ...mapActions("data/arbitrage_session", {
      as_create: "create",
      fetchAs: "fetchList",
    }),
    ...mapActions("data/wallet", {
      fetchWallet: "fetchList",
      wall_create: "create",
    }),
    validate_amount(act) {
      if (!this.amount) {
        this.err_m = [this.$t("amount_required")];
        return false;
      }
      if (act == "Buy") {
        let ttl = parseFloat(this.amount_usd);
        if (!this.wl.balance || ttl > this.wl.balance) {
          this.err_m = [this.$t("not_enough_balance")];
          return false;
        }
      } else {
        let ttl = parseFloat(this.amount);
        if (!this.userWallet.balance || ttl > this.userWallet.balance) {
          this.err_m = [this.$t("not_enough_balance")];
          return false;
        }
      }
      return true;
    },
    async save(act) {
      let load = "loading";
      if (!act || typeof act != "string") {
        act = this.action;
      } else {
        if (act == "Sell") {
          load = "loadingSell";
        }
      }
      let valid = this.validate_amount(act);
      if (!valid) {
        return;
      }
      this[load] = true;

      let as_data = {
        amount: this.amount,
        arbitrage_company_id: this.tradePlatform.id,
        session_start_type_id: act === "Buy" ? 1 : 2,
        exchange_wallet_id: this.wl.id,
        currency_id: this.tradeItem.id,
      };
      // code
      as_data.start_exchange_rate = this.price;
      let rs = await this.as_create({ data: as_data });
      let title, color;
      if (rs.data && rs.data.status_id != 1) {
        title = this.$t("not_enough_balance");
        color = "error";
      } else {
        title = this.$t("arbitrage_session_processing");
        color = "warning";
        setTimeout(() => {
          this.$store.commit("data/notifications/create", {
            id: color + "_" + Math.random().toString(36),
            title: this.$t("arbitrage_session_done"),
            text: this.$t("arbitrage_session_done"),
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
      this.fetchWallet();
      setTimeout(() => {
        this[load] = false;
        this.$emit("reload");
        this.close();
      }, 500);
    },

    close() {
      this.$emit("close");
    },
  },
  async created() {
    this.wl = this.wallet.find((el) => el.currency.symbol == "USD") || {};
  },
  async mounted() {
    console.log("this.action :>> ", this.action);
    console.log("this.balance :>> ", this.balance);
  },
};
</script>

<style lang="scss" scoped>
.green_gradi {
  background: linear-gradient(
    163.28deg,
    var(--start_blue_gradient) 0%,
    var(--end_blue_gradient) 85.7%
  ) !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  background-clip: text !important;
  position: relative !important;
}
.green_gradi:after {
  position: absolute;
  content: "";
  width: 100%;
  min-height: 6px !important;
  top: -9px;
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
  position: relative !important;
}
.red_gradi::after {
  position: absolute;
  content: "";
  width: 100%;
  min-height: 6px !important;
  top: -9px;
  left: 0;
  background: linear-gradient(
    176.35deg,
    var(--start_red_gradient) 0.47%,
    var(--end_red_gradient) 97%
  ) !important;
  border-radius: 0px 0px 4px 4px;
}
.green_btn {
  width: 100%;
  background: linear-gradient(
    163.28deg,
    var(--start_blue_gradient) 0%,
    var(--end_blue_gradient) 85.7%
  );
  color: white !important;
  border-radius: 10px !important;
}
.red_btn {
  width: 100%;
  background: linear-gradient(
    163.28deg,
    var(--start_red_gradient) 0%,
    var(--end_red_gradient) 85.7%
  );
  color: white !important;
  border-radius: 10px !important;
}
.dotsLine {
  display: inline;
  width: inherit;
  border-bottom: dotted 1px;
}
.c-actions {
  position: absolute;
  margin: 12px;
  bottom: 0;
  right: 0;
}
.c-actions-sell {
  position: absolute;
  margin: 12px;
  bottom: 0;
  left: 0;
}
.list_group {
  height: 66px !important;
  position: relative !important;
}
.list_group::after {
  position: absolute;
  content: "";
  width: 100%;
  height: 1px;
  bottom: 0;
  background: #bcbcbc1a;
}
.card {
  border: 1px solid #bcbcbc1a;
}
html[theme="dark"] .card_text {
  color: var(--white) !important;
  letter-spacing: -1px;
}
html[theme="light"] .card_text {
  color: var(--black) !important;
  letter-spacing: -1px;
}
</style>
