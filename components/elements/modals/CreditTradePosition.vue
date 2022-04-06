<template>
  <v-card :height="height ? height : undefined">
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
    <v-card-text>
      <v-row class="mb-0">
        <v-col :cols="6">
          <v-btn
            block
            :class="action == 'Sell' ? 'green--text' : 'green'"
            :outlined="action == 'Sell'"
            dark
            elevation="0"
            @click="action = 'Buy'"
            >{{ $t("buy") }}</v-btn
          >
        </v-col>
        <v-col :cols="6">
          <v-btn
            block
            elevation="0"
            :class="action == 'Sell' ? 'red' : 'red--text'"
            :outlined="action == 'Sell'"
            @click="action = 'Sell'"
            >{{ $t("sell") }}</v-btn
          >
        </v-col>
      </v-row>
      <v-container class="d-flex justify-lg-space-between font-weight-medium">
        <span>{{ $t("marketplace_price") }}</span>
        <span>{{ price }} USD</span>
      </v-container>
      <v-container class="d-flex justify-lg-space-between">
        <span>{{ `${$t("available_balance")}` }}</span>
        <span>{{ balance }}</span>
      </v-container>
      <v-container>
        <v-row class="pl-3 mb-0 mt-0">
          <v-btn
            class="mr-3"
            v-for="(item, i) in credit_vars"
            :key="i"
            :class="credit_x == item ? 'primary' : 'primary--text'"
            @click="credit_x = item"
            >{{ "x" + item }}</v-btn
          >
        </v-row>
        <v-row class="pl-3 mb-0 mt-4">
          <v-slider
            hide-details
            :max="max_x"
            :min="1"
            v-model="credit_x"
          ></v-slider>
        </v-row>
      </v-container>
      <v-container>
        <v-text-field
          :label="action == 'Buy' ? $t('choose_amount') : $t('total')"
          v-model="amount_usd"
          outlined
          dense
          :readonly="action == 'Sell'"
          :suffix="action == 'Buy' ? `${credit_x * amount_usd} USD` : 'USD'"
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
              ? `${credit_x * amount} ${tradeItem.symbol}`
              : tradeItem.symbol
          "
          :error-messages="err_m"
          type="number"
        ></v-text-field>
      </v-container>
    </v-card-text>
    <v-card-actions class="c-actions">
      <v-btn color="green" type="submit" text :loading="loading" @click="save">
        {{ action === "Sell" ? $t("sell") : $t("buy") }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "TradePosition",
  data() {
    return {
      amount: "",
      action: "Buy",
      am_ch: true,
      amusd_ch: true,
      amount_usd: "",
      wl: {},
      loading: false,
      loadingSell: false,
      err_m: null,
      credit_x: 10,
      max_x: 100,
      credit_vars: [10, 20, 50, 100],
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
    height: {
      type: Number,
      default: 500,
    },
  },
  computed: {
    ...mapGetters("data/credit_session", {
      as: "list",
    }),
    ...mapGetters("data/wallet", {
      wallet: "list",
    }),
    balance() {
      if (this.action === "Sell") {
        if (this.userWallet.currency) {
          return (
            this.userWallet.balance + " " + this.userWallet.currency.symbol
          );
        }
      } else {
        if (this.wl.currency) {
          return this.wl.balance + " " + this.wl.currency.symbol;
        }
      }
    },
  },
  watch: {
    action() {
      this.amount = null;
      this.amount_usd = null;
    },
    credit_x() {
      if (this.action == "Buy") {
        this.am_ch = false;
        this.amount =
          (parseFloat(this.amount_usd) * this.credit_x) / this.price;
      } else {
        this.amusd_ch = false;
        this.amount_usd = parseFloat(this.amount) * this.credit_x * this.price;
      }
    },
    amount() {
      this.err_m = null;
      if (this.amount && this.am_ch) {
        this.amusd_ch = false;
        this.amount_usd = parseFloat(this.amount) * this.credit_x * this.price;
      } else {
        this.am_ch = true;
      }
    },
    amount_usd() {
      this.err_m = null;
      if (this.amount_usd && this.amusd_ch) {
        this.am_ch = false;
        this.amount =
          (parseFloat(this.amount_usd) * this.credit_x) / this.price;
      } else {
        this.amusd_ch = true;
      }
    },
  },
  methods: {
    ...mapActions("data/credit_session", {
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
      let amount = act == 'Buy' ? this.amount : this.amount * this.credit_x;
      let as_data = {
        self_amount: amount / this.credit_x,
        amount: amount,
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
        }, 2000);
      }
      this.$store.commit("data/notifications/create", {
        id: color + "_" + Math.random().toString(36),
        title: title,
        text: title,
        color: color,
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
};
</script>

<style lang="scss" scoped>
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
</style>
