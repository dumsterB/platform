<template>
  <div class="ac-comp">
    <h3 class="mb-2">{{ $t("user_arbitrage") }}</h3>
    <v-data-table
      :items="list"
      :headers="headers"
      :items-per-page="perpage"
      :footer-props="{
        'items-per-page-options': [5, 10, 20],
        'items-per-page-text': $t('items_per_page'),
      }"
      class="elevation-4 space mainBorderRadius pl-4 pr-4 ml-0"
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
        <span style="font-size: 13px">{{
          item.price ? "$" + item.price : "no data"
        }}</span>
      </template>
      <template v-slot:[`item.action`]="{ item }">
        <div class="d-flex justify-end">
          <v-btn
            x-small
            @click="buy(item)"
            class="ml-1 green_btn text-capitalize"
            :style="customStyle"
            :disabled="!item.price"
          >
            {{ $t("buy") }}
          </v-btn>
          <v-btn
            x-small
            @click="sell(item)"
            class="ml-1 red_btn text-capitalize"
            :style="customStyle"
            :disabled="!item.price"
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
import config from "~/config/config.json";
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
      start_blue_gradient: config.colors.start_blue_gradient,
      end_blue_gradient: config.colors.end_blue_gradient,
      start_red_gradient: config.colors.start_red_gradient,
      end_red_gradient: config.colors.end_red_gradient,
      dark_disabled: config.colors.dark_disabled_primary_btn,
      light_disabled: config.colors.light_disabled_primary_btn,
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
    customStyle() {
      return {
        "--start_blue_gradient": this.start_blue_gradient,
        "--end_blue_gradient": this.end_blue_gradient,
        "--start_red_gradient": this.start_red_gradient,
        "--end_red_gradient": this.end_red_gradient,
        "--dark_disabled": this.dark_disabled,
        "--light_disabled": this.light_disabled,
      };
    },
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
          sortable: false,
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
        let fnd = prices ? prices.find((e) => e && e.company == el.name) : null;
        let pr = 0;
        if (fnd && fnd.price) pr = fnd.price;
        el.price = pr;
        return el;
      });
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
    this.resetList();
  },
};
</script>

<style lang="scss">
.v-application .ml-8 {
  margin-left: 15px !important;
}
.ac-comp .v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
  padding: 0 6px !important;
}
.v-application--is-ltr .v-data-footer__select {
  margin: 0;
}
html[theme="dark"] {
  .green_btn {
    background: linear-gradient(
      163.28deg,
      var(--start_blue_gradient) 0%,
      var(--end_blue_gradient) 85.7%
    );
    color: white !important;
    border-radius: 10px !important;
    &:disabled {
      background: linear-gradient(
          0deg,
          var(--dark_disabled),
          var(--dark_disabled)
        ),
        linear-gradient(
          163.28deg,
          var(--start_blue_gradient) 0%,
          var(--end_blue_gradient) 85.7%
        );
    }
  }
  .red_btn {
    background: linear-gradient(
      163.28deg,
      var(--start_red_gradient) 0%,
      var(--end_red_gradient) 85.7%
    );
    color: white !important;
    border-radius: 10px !important;
    &:disabled {
      background: linear-gradient(
          0deg,
          var(--dark_disabled),
          var(--dark_disabled)
        ),
        linear-gradient(
          163.28deg,
          var(--start_red_gradient) 0%,
          var(--end_red_gradient) 85.7%
        );
    }
  }
}
html[theme="light"] {
  .green_btn {
    background: linear-gradient(
      163.28deg,
      var(--start_blue_gradient) 0%,
      var(--end_blue_gradient) 85.7%
    );
    color: white !important;
    border-radius: 10px !important;
    &:disabled {
      background: linear-gradient(
          0deg,
          var(--light_disabled),
          var(--light_disabled)
        ),
        linear-gradient(
          163.28deg,
          var(--start_blue_gradient) 0%,
          var(--end_blue_gradient) 85.7%
        );
    }
  }
  .red_btn {
    background: linear-gradient(
      163.28deg,
      var(--start_red_gradient) 0%,
      var(--end_red_gradient) 85.7%
    );
    color: white !important;
    border-radius: 10px !important;
    &:disabled {
      background: linear-gradient(
          0deg,
          var(--light_disabled),
          var(--light_disabled)
        ),
        linear-gradient(
          163.28deg,
          var(--start_red_gradient) 0%,
          var(--end_red_gradient) 85.7%
        );
    }
  }
}
</style>
