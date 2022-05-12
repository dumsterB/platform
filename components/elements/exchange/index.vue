<template>
  <div class="pt-2 buy-sell-comp">
    <div class="mr-4 d-flex mdc-form-field--space-between">
      <p class="text-h6 font-weight-bold">{{ $t("exchange") }}</p>
    </div>

    <v-card class="pa-3" elevation="4">
      <v-list width="100%" class="pa-0 borderNone">
        <v-list-item-group v-model="btn_active" class="d-flex">
          <v-list-item
            tag="button"
            block
            elevation="0"
            class="btn_exchange pa-0"
            :style="customStyle"
            active-class="active_btn_exchange"
            @click="buyHandler"
            >{{ $t("buy") }}</v-list-item
          >

          <v-list-item
            tag="button"
            block
            elevation="0"
            class="btn_exchange pa-0"
            :style="customStyle"
            active-class="active_btn_exchange"
            @click="sellHandler"
            >{{ $t("sell") }}</v-list-item
          >
        </v-list-item-group>
      </v-list>
      <v-divider class="divider_border" :style="customStyle"></v-divider>
      <div class="chips mt-3 mx-3">
        <v-chip
          :class="[item.active ? 'active_p_chip' : 'p_chip']"
          :style="customStyle"
          class="pl-4 pr-4"
          x-small
          v-for="(item, i) of chips"
          :key="i"
          @click="chipHandler(item)"
          >{{ item.percent + " %" }}</v-chip
        >
      </div>
      <div class="justify-center text-center">
        <div class="justify-space-between d-flex text-left">
          <v-col class="pb-1">
            <span class="small_text pl-1 icon_color--text"
              >{{ $t("choose_crypto") }}:</span
            >
            <v-autocomplete
              v-model="buy_curr"
              :items="currency"
              label=""
              class="currency_selector"
              item-text="name"
              item-value="symbol"
              solo
              dense
              hide-details
              append-icon="mdi-chevron-down"
            >
              <template v-slot:selection="{ item }">
                <v-chip
                  class="ma-0 pa-0"
                  style="background: transparent !important"
                >
                  <v-row class="ma-0 pa-0">
                    <img
                      height="20"
                      :src="item.logo"
                      :alt="item.name"
                      class="mr-2"
                    />
                    <strong>{{ item.name }}</strong>
                  </v-row>
                </v-chip>
              </template>
              <template v-slot:item="{ item }">
                <img height="20" width="20" :src="item.logo" />
                <p class="ml-4 mt-3">{{ item.name }}</p>
              </template>
            </v-autocomplete>
          </v-col>
          <v-col class="pb-1">
            <span class="small_text pl-1 icon_color--text"
              >{{ $t("Get") }}:</span
            >
            <span class="d-flex mr-2">
              <v-text-field
                v-model="buy"
                solo
                dense
                hide-details
                class="value-field elevation-0 success--text"
                type="number"
                :suffix="buy_curr"
              ></v-text-field>
            </span>
          </v-col>
        </div>
        <div class="justify-space-between d-flex text-left">
          <v-col class="mt-0 pt-0">
            <span class="small_text pl-1 icon_color--text"
              >{{ $t("Pay") }}:</span
            >
            <span class="d-flex mr-2">
              <v-text-field
                v-model="pay"
                solo
                dense
                hide-details
                class="value-field elevation-0 success--text"
                type="number"
                suffix="USD"
              ></v-text-field>
            </span>
          </v-col>
        </div>
        <v-divider class="divider" :style="customStyle"></v-divider>
        <div class="text-left ml-2">
          <span class="small_text accent--text">{{
            `Min ${min_val} ${buy_curr} - Max ${max_val} ${buy_curr}`
          }}</span>
          <h5 class="mt-1">
            {{ $t("available_balance") }}:
            {{ new Intl.NumberFormat().format(balance) }}
            {{ active_btn == "buy" ? "USD" : buy_curr }}
          </h5>
        </div>
        <br />
        <v-btn
          block
          large
          class="success-btn mb-3 mainBorderRadius"
          :style="customStyle"
          elevation="0"
          @click="trade_run"
          :loading="loading"
          >{{ loading ? "" : `${$t(active_btn)} ${buy_curr}` }} {{
        }}</v-btn>
      </div>
    </v-card>
    <!-- <v-row class="mt-10 d-flex align-center justify-start">
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
    <br /> -->
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
      primary: config.colors.text.primary,
      dark_item_bg: config.themes.dark.item_bg,
      light_item_bg: config.themes.light.item_bg,
      link_url: "bc1qu75kr9s9j0hpuf5qugqdastwwhzglz3gfwcz06",
      copied: false,
      loading: false,
      ex_rate: 1,
      buy: 0,
      pay: 0,
      buy_checker: true,
      pay_checker: true,
      buy_curr: "BTC",
      active_btn: "buy",
      btn_active: 0,
      min_val: 0.00001,
      max_val: 100,
      chips: [
        { percent: 0, active: false },
        { percent: 10, active: false },
        { percent: 25, active: false },
        { percent: 50, active: false },
        { percent: 75, active: false },
        { percent: 100, active: false },
      ],
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
    buyHandler() {
      this.active_btn = "buy";
    },
    sellHandler() {
      this.active_btn = "sell";
    },
    chipHandler(value) {
      this.chips.map((ell) => (ell.active = false));
      value.active = true;
      if (this.active_btn == "buy") {
        let curr = this.currency.find((el) => el.symbol == this.buy_curr);
        this.buy =
          Math.round(
            ((this.balance * value.percent) / curr.price / 100) * 1000000
          ) / 1000000;
      }
      if (this.active_btn == "sell") {
        this.buy =
          Math.round(((this.balance * value.percent) / 100) * 1000000) /
          1000000;
      }
    },
    buy_def() {
      if (this.buy) {
        let t_price;
        if (this.active_btn == "buy") {
          t_price = this.price * this.buy;
        } else {
          t_price = this.price * this.buy;
        }
        this.pay = Math.round(t_price * 1000000) / 1000000;
      } else {
        this.pay = null;
      }
    },
    pay_def() {
      if (this.pay) {
        let am;
        if (this.active_btn == "buy") {
          am = this.pay / this.price;
        } else {
          am = this.pay / this.price;
        }
        this.buy = Math.round(am * 1000000) / 1000000;
      } else {
        this.buy = null;
      }
    },
    async copyURL() {
      try {
        await navigator.clipboard.writeText(this.link_url);
        this.copied = true;
        setTimeout(() => {
          this.copied = false;
        }, 1500);
      } catch (e) {
        console.log(e);
      }
    },
    def_min_max() {
      this.max_val = Math.round((1000000 * 100000) / this.price) / 100000;
      this.min_val = Math.round((10 * 100000) / this.price) / 100000;
    },
    def_price() {
      let curr = this.currency.find((el) => el.symbol == this.buy_curr);
      this.price = curr && curr.price ? curr.price : 1;
    },
    async trade_run() {
      this.loading = true;
      let trade_data = {};
      let curr = this.currencies.find((el) => el.symbol == this.buy_curr);
      if (curr) {
        if (!this.buy_sell) {
          trade_data.source_currency_id = curr.id;
          trade_data.source_amount = parseFloat(this.buy);
        } else {
          trade_data.dest_currency_id = curr.id;
          trade_data.dest_amount = parseFloat(this.buy);
        }
      }
      trade_data.exchange_rate = this.price;
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
            title: this.$t("create_trade"),
            text: this.$t("create_trade"),
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
      await this.fWallets();
      this.$emit("reload");
      this.loading = false;
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
        "--primary": this.primary,
        "--dark_item_bg": this.dark_item_bg,
        "--light_item_bg": this.light_item_bg,
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
    balance() {
      if (this.active_btn == "buy") {
        let wl = this.wallets.find((el) => el.currency.symbol == "USD");
        return wl ? wl.balance : 0;
      }
      if (this.active_btn == "sell") {
        let wl = this.wallets.find((el) => el.currency.symbol == this.buy_curr);
        return wl ? wl.balance : 0;
      }
    },
  },
  watch: {
    buy() {
      if (this.buy_checker) {
        this.pay_checker = false;
        this.buy_def();
      } else {
        this.buy_checker = true;
      }
    },
    pay() {
      if (this.pay_checker) {
        this.buy_checker = false;
        this.pay_def();
      } else {
        this.pay_checker = true;
      }
    },
    buy_curr() {
      this.def_price();
      this.def_min_max();
      this.pay = 0;
    },
  },
  created() {
    this.def_price();
    this.def_min_max();
  },
};
</script>

<style scoped lang="scss">
.success-btn {
  background: var(--primary) !important;
  border: solid 2px var(--primary) !important;
  color: white !important;
  border-radius: 10px;
  font-weight: 700;
  font-size: 18px;
  line-height: 22px;
  letter-spacing: 0;
}

.btn_exchange {
  padding: 10px 10px 10px 0px;
  justify-content: center;
  margin-top: -7px;
  font-weight: 400;
  font-size: 18px;
  text-transform: uppercase;
  border-top: 3px solid transparent;
  background: transparent !important;
  color: #9a9a9a !important;
}
.active_btn_exchange {
  position: relative;
  padding: 10px 10px 10px 0px;
  justify-content: center;
  margin-top: -7px;
  font-weight: 700;
  font-size: 18px;
  text-transform: uppercase;
  border-top: 3px solid transparent;
  background: transparent !important;
  color: var(--primary) !important;
}
.active_btn_exchange::after {
  position: absolute;
  content: "";
  width: 100%;
  min-height: 6px !important;
  top: -8px;
  left: 0;
  background: var(--primary) !important;
  border-radius: 0px 0px 4px 4px;
}
html[theme="light"] .p_chip {
  background: #eeeeee !important;
  padding: 12px;
  justify-content: space-between;
  display: flex;
  color: #9a9a9a;
}
.p_chip {
  background: #001935 !important;
  padding: 12px;
  justify-content: space-between;
  display: flex;
  color: #ffffff;
}
.active_p_chip {
  background: var(--primary) !important;
  padding: 12px;
  justify-content: space-between;
  display: flex;
  color: #ffffff;
}

.chips {
  justify-content: space-between;
  display: flex;
}
.small_text {
  font-weight: 300;
  font-size: 12px;
  line-height: 14px;
}
</style>
<style lang="scss">
.buy-sell-comp .v-input__slot {
  border-radius: 10px;
  background: #161f49 !important;
  border-radius: 10px;
}
html[theme="light"] .buy-sell-comp .v-input__slot {
  background: linear-gradient(
      0deg,
      rgba(226, 226, 226, 0.3),
      rgba(226, 226, 226, 0.3)
    ),
    #ffffff !important;
}
.buy-sell-comp .value-field .v-input__slot {
  font-size: 20px !important;
  font-weight: 600 !important;
}
.buy-sell-comp .v-text-field__suffix {
  font-weight: 500;
  font-size: 18px;
  line-height: 22px;
}
.currency_selector {
  height: 30px !important;
}
.divider {
  border-color: var(--dark_item_bg) !important;
}
.divider_border {
  border-color: #bcbcbc1a !important;
}
html[theme="light"] {
  .divider {
    border-color: var(--light_item_bg) !important;
  }
  .divider_border {
    border-color: transparent !important;
  }
}
</style>
