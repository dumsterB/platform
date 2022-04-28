<template v-slot:[`item.action`]="{ item }">
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
      <v-container class="d-flex justify-lg-space-between font-weight-medium">
        <span>{{ $t("marketplace_price") }}</span>
        <span>{{ new Intl.NumberFormat().format(price) }} USD</span>
      </v-container>
      <v-container class="d-flex justify-lg-space-between">
        <span>{{ `${$t("available_balance")}` }}</span>
        <span>{{ balance }}</span>
      </v-container>
      <v-container>
        <v-text-field
          :label="`${$t('choose_amount')}`"
          v-model="amount_usd"
          outlined
          dense
          suffix="USD"
          hide-details
          type="number"
        ></v-text-field>
      </v-container>
      <v-container>
        <v-text-field
          :label="`${$t('total')}`"
          v-model="amount"
          outlined
          dense
          :suffix="tradeItem.symbol"
          :error-messages="err_m"
          type="number"
        ></v-text-field>
      </v-container>
    </v-card-text>
    <v-card-actions v-if="action == 'Both'">
      <v-btn
        v-if="userWallet && userWallet.balance"
        class="c-actions-sell"
        color="red "
        type="submit"
        text
        :loading="loadingSell"
        @click="save('Sell')"
      >
        {{ $t("sell") }}
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn
        class="c-actions"
        color="green "
        type="submit"
        text
        :loading="loading"
        @click="save('Buy')"
      >
        {{ $t("buy") }}
      </v-btn>
    </v-card-actions>
    <v-card-actions v-else class="c-actions">
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
    action: {
      type: String,
      default: "",
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
      default: 400,
    },
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
  },
  watch: {
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
        let ttl = parseFloat(this.amount) * this.price;
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
