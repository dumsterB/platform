<template>
  <div class=" pt-2">
    <div class="mx-4 d-flex mdc-form-field--space-between">
      <p class="text-h6">{{ $t("exchange") }}</p>
    </div>

    <v-card class="pa-3" elevation="4">
      <div class="tabs_exchange">
        <button class="btn_exchange" :class="[active_btn == 'buy' ? 'active_btn_exchange' : '']" @click="buyHandler">{{$t('buy')}}</button>
        <button class="btn_exchange" :class="[active_btn == 'sell' ? 'active_btn_exchange' : '']" @click="sellHandler">{{$t('sell')}}</button>
      </div>
      <div class="chips  mt-3">
        <v-chip :class="[item.active ? 'active_chip':'chip']" class=" pl-4 pr-4 chip" x-small v-for="(item ,i) of chips" :key="i" @click="chipHandler(item)">{{item.percent}}</v-chip>
      </div>
      <div class="justify-center text-center">
        <div class=" justify-space-between d-flex">
          <v-col>
            <span class="small_text">{{$t('Choose the crypto:')}}</span>
          <v-autocomplete
              v-model="buy_curr"
              :items="currencies"
              height="31"
              label=""
              class="ml-2 currency_selector"
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
          </v-col>
<v-col>
          <h1 class="d-flex mt-5">0.056 <span style="color: #BFB5FF;font-weight: 700;font-size: 18px;line-height: 22px;" class="ml-2 mt-4">BTC</span></h1>
</v-col>
        </div>
        <br>
        <v-divider></v-divider>
        <div class="text-left ml-2">
          <span class="small_text">{{$t('Min 0.0001 BTC - Max 10,000 BTC')}}</span>
          <h5>Available Balance:  3.5849 BTC</h5>
        </div>
        <br>
        <v-btn
            block
            large
            rounded
            class="success-btn mb-3"
            :style="customStyle"
            elevation="0"
            @click="trade_run"
            :loading="loading"
        >{{ $t("buy") }} Bitcoin</v-btn
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
      pay: null,
      buy: null,
      pay_curr: "USD",
      buy_curr: "BTC",
      buy_checker: false,
      pay_checker: false,
      loading: false,
      ex_rate: 1,
      active_btn:'buy',
      chips:[{percent:'0 %',active:false },{percent:'10%',active:false },{percent:'25%',active:false },{percent:'50 %',active:false },{percent:'75 %',active:false },{percent:'100%',active:false }]
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
    buyHandler(){
      this.active_btn='buy'
      console.log('buyyy')
      this.$forceUpdate()
    },
    sellHandler(){
      this.active_btn='sell'
      console.log('sell')

      this.$forceUpdate()
    },
    chipHandler(value){
      this.chips.map(ell=>ell.active=false)
      value.active=true
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
.tabs_exchange{
  justify-content: space-between;
  display: flex;
}
.btn_exchange{
  width: 150px;
  padding: 10px 10px 10px 0px;
  margin-top: -7px;
  font-weight: 700;
  font-size: 18px;
  text-transform: uppercase;
  border-top:3px solid transparent;
}
.active_btn_exchange{
  color: #007BFF;
  border-top:3px solid #007BFF;
  border-radius: 0px 0px 10px 10px!important;
}
.chip{
  background: #001935!important;
  padding: 12px;
  justify-content: space-between;
  display: flex;
}
.active_chip{
  background: #007BFF!important;
}
.chips{
  justify-content: space-between;
  display: flex;
}
.currency_selector{
  background: #001935!important;
  height: 30px!important;
}
.v-text-field {
  min-height: 30px!important;
  height: 31px!important;
}
.v-input__control{
  min-height: 30px!important;
  height: 31px!important;
}
.small_text{
  font-weight: 300;
  font-size: 13px;
}
.v-text-field.v-text-field--solo .v-input__control {
  min-height: 38px!important;
  padding: 0;
}
</style>
