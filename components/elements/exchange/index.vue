<template>
  <div class="pt-2">
    <div class="mx-4 d-flex mdc-form-field--space-between">
      <p class="text-h6">{{ $t("exchange") }}</p>
    </div>

    <v-card class="pa-3" elevation="4">
      <div class="tabs_exchange">
        <v-row
          ><v-col lg="6"
            ><v-btn
              block
              elevation="0"
              class="btn_exchange"
              :class="[active_btn == 'buy' ? 'active_btn_exchange' : '']"
              @click="buyHandler"
              >{{ $t("buy") }}</v-btn
            > </v-col
          ><v-col lg="6"
            ><v-btn
              block
              elevation="0"
              class="btn_exchange"
              :class="[active_btn == 'sell' ? 'active_btn_exchange' : '']"
              @click="sellHandler"
              >{{ $t("sell") }}</v-btn
            ></v-col
          ></v-row
        >
      </div>
      <div class="chips mt-3 mx-3">
        <v-chip
          :class="[item.active ? 'active_chip' : 'chip']"
          class="pl-4 pr-4 chip"
          x-small
          v-for="(item, i) of chips"
          :key="i"
          @click="chipHandler(item)"
          >{{ item.percent + ' %' }}</v-chip
        >
      </div>
      <div class="justify-center text-center">
        <div class="justify-space-between d-flex">
          <v-col>
            <span class="small_text">{{ $t("Choose the crypto:") }}</span>
            <v-autocomplete
              v-model="buy_curr"
              :items="currency"
              label=""
              class="ml-2 currency_selector"
              item-text="name"
              item-value="symbol"
              solo
              dense
              hide-details
            >
              <template v-slot:item="{ item }">
                <img height="20" width="20" :src="item.logo" />
                <p class="ml-4 mt-3">{{ item.name }}</p>
              </template>
            </v-autocomplete>
          </v-col>
          <v-col>
            <span class="d-flex mr-6 mt-2">
              <v-text-field
                v-model="buy"
                solo
                hide-details
                class="value-field elevation-0"
                type="number"
              ></v-text-field>
              <span
                style="
                  color: #bfb5ff;
                  font-weight: 700;
                  font-size: 18px;
                  line-height: 22px;
                "
                class="ml-2 mt-6"
                >{{ buy_curr }}</span
              >
            </span>
          </v-col>
        </div>
        <v-divider></v-divider>
        <div class="text-left ml-2">
          <span class="small_text">{{
            `Min 0.0001 ${buy_curr} - Max 10,000 ${buy_curr}`
          }}</span>
          <h5>
            Available Balance: {{ balance }}
            {{ active_btn == "buy" ? "USD" : buy_curr }}
          </h5>
        </div>
        <br />
        <v-btn
          block
          large
          rounded
          class="success-btn mb-3"
          :style="customStyle"
          elevation="0"
          @click="trade_run"
          :loading="loading"
          >{{ $t(active_btn) }} {{ buy_curr }}</v-btn
        >
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
      link_url: "bc1qu75kr9s9j0hpuf5qugqdastwwhzglz3gfwcz06",
      copied: false,
      loading: false,
      ex_rate: 1,
      buy: 0,
      buy_curr: "BTC",
      active_btn: "buy",
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
        let curr = this.currency.find(el => el.symbol == this.buy_curr);
        this.buy = Math.round(this.balance * value.percent / curr.price / 100 * 1000000) / 1000000;
      }
      if (this.active_btn == "sell") {
        this.buy = Math.round(this.balance * value.percent / 100 * 1000000) / 1000000;
      } 
    },
    async copyURL() {
      try {
        //*TODO - документация обещает, что navigator.clipboard будет работать при https соеденении. Иначе нужен иной способ
        await navigator.clipboard.writeText(this.link_url);
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
      let usd_c = this.currencies.find((el) => el.symbol == "USD");
      let curr = this.currency.find((el) => el.symbol == this.buy_curr);
      if (curr && usd_c) {
        trade_data.source_currency_id = this.active_btn == 'buy' ? usd_c.id : curr.id;
        trade_data.source_amount = this.active_btn == 'buy' ? this.buy*curr.price : this.buy;
        trade_data.dest_currency_id = this.active_btn == 'buy' ? curr.id : usd_c.id;
        trade_data.dest_amount = this.active_btn == 'buy' ? this.buy : this.buy*curr.price;
        trade_data.exchange_rate = this.active_btn == 'buy' ? 1/curr.price : curr.price;
      }
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
.tabs_exchange {
  justify-content: space-between;
  display: flex;
}
.btn_exchange {
  padding: 10px 10px 10px 0px;
  margin-top: -7px;
  font-weight: 700;
  font-size: 18px;
  text-transform: uppercase;
  border-top: 3px solid transparent;
  background: transparent !important;
}
.active_btn_exchange {
  color: #007bff;
  border-top: 3px solid #007bff;
  border-radius: 0px 0px 10px 10px !important;
}
.chip {
  background: #001935 !important;
  padding: 12px;
  justify-content: space-between;
  display: flex;
}
.active_chip {
  background: #007bff !important;
}
.chips {
  justify-content: space-between;
  display: flex;
}
.small_text {
  font-weight: 300;
  font-size: 13px;
}
.v-text-field.v-text-field--solo .v-input__control {
  padding: 0;
}
</style>
<style>
.currency_selector .v-input__slot {
  background: rgba(154, 154, 154, 0.3) !important;
  border-radius: 10px;
}
.value-field  .v-input__slot {
  background: transparent !important;
  height: 56px !important;
  font-size: 22px !important;
  font-weight: 600;
}
.currency_selector {
  height: 30px !important;
}
</style>
