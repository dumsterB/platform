<template>
  <div class="ac-comp">
    <h3 class="ml-2 mb-2">Arbitrage</h3>
    <v-data-table
      :items="list"
      :headers="headers"
      :items-per-page="perpage"
      :footer-props="{
        'items-per-page-options': [5, 10, 20],
      }"
      class="elevation-4 space rounded-lg pl-4 pr-4 ml-0"
    >
      <template v-slot:[`item.name`]="{ item }"
        ><v-img
          contain
          tag="img"
          height="20px"
          width="80px"
          :src="item.logo"
          :alt="item.name"
          class=""
        >
        </v-img>
      </template>
      <template v-slot:[`item.price`]="{ item }">
        <span style="font-size: 13px">{{ item.price ? "$" + item.price : "no data" }}</span>
      </template>
      <template v-slot:[`item.action`]="{ item }">
        <div class="d-flex justify-end">
          <v-btn
            x-small
            @click="buy(item)"
            class="ml-1 green--text"
            style="border-radius: 10px"
            outlined
          >
            {{ $t("buy") }}
          </v-btn>
          <v-btn
            x-small
            @click="sell(item)"
            class="ml-1 red--text"
            style="border-radius: 10px"
            outlined
          >
            {{ $t("sell") }}
          </v-btn>
        </div>
      </template>
    </v-data-table>
    <v-dialog v-model="dialog" max-width="600px">
      <TradePosition
        :tradeItem="current"
        :action="action"
        :userWallet="userWallet ? userWallet : { balance: null }"
        :tradePlatform="selected"
        :price="selected ? selected.price : null"
        @close="closeTrade"
        @reload="$emit('reload')"
      />
    </v-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import TradePosition from "~/components/elements/modals/TradePosition.vue";
const modelCompanies = "data/arbitrage_company";
const modelCurrencies = "data/currency";

export default {
  components: { TradePosition },
  props: {
    currency: {
      type: String,
      default: "BTC",
    },
    prices: {
      type: Array,
      default: () => {
        return [];
      },
    },
    current: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      dialog: false,
      perpage: 10,
      list: [],
      interv: null,
      action: null,
      selected: null,
      userWallet: null,
    };
  },
  computed: {
    ...mapGetters(modelCompanies, {
      ac: "list",
    }),
    ...mapGetters("data/wallet", {
      wallets: "list",
    }),
    headers() {
      return [
        {
          text: this.$t("name_table"),
          value: "name",
          width: 100,
        },
        {
          text: this.$t("price"),
          value: "price",
          width: 70,
        },
        {
          text: "",
          value: "action",
          width: 100,
        },
      ];
    },
  },
  watch: {
    prices() {
      this.resetList(this.prices);
    },
  },
  methods: {
    ...mapActions(modelCompanies, {
      fetchList: "fetchList",
    }),

    resetList(prices) {
      this.list = this.ac.map((el) => {
        let fnd = prices.find((e) => e && e.company == el.name);
        let pr = 0;
        if (fnd && fnd.price) pr = fnd.price;
        el.price = pr;
        return el;
      });
    },
    diffColor(diff) {
      let nm = parseFloat(diff);
      if (nm < 0) {
        return "color: 'red';";
      } else {
        return "color: 'green';";
      }
    },
    buy(item) {
      this.action = "Buy";
      this.dialog = true;
      this.selected = this.list.find((elem) => elem.name === item.name);

      this.userWallet = this.wallets.find(
        (el) => el.currency.symbol === this.current.symbol
      );
    },
    sell(item) {
      this.action = "Sell";
      this.dialog = true;
      this.selected = this.list.find((elem) => elem.name === item.name);
      this.userWallet = this.wallets.find(
        (el) => el.currency.symbol === this.current.symbol
      );
    },
    closeTrade() {
      this.action = null;
      this.dialog = false;
      this.selected = null;
      this.userWallet = null;
    },
  },
  async created() {
    // this.create({ data: {} });
  },
};
</script>

<style lang="scss">
.space {
  margin-left: -22px !important;
}
.ac-comp .v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
  padding: 0 6px !important;
}
.v-application--is-ltr .v-data-footer__select {
  margin: 0;
}
</style>
