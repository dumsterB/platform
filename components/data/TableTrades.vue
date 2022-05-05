<template>
  <div>
    <v-data-table
      :items="list"
      :headers="headers"
      :items-per-page="page_size_current"
      :search="search"
      sort-by="created_at"
      :loading="loading"
      :sort-desc="true"
      class="elevation-1 ma-4 ml-8"
      :server-items-length="totalLength"
      @pagination="paging"
      :footer-props="{
        'items-per-page-options': [5, 10, 20, 50],
        'items-per-page-text': $t('items_per_page'),
      }"
    >
      <template v-slot:top>
        <v-toolbar flat class="borderNone">
          <v-toolbar-title class="font-weight-bold">{{
            $t("recent_trades")
          }}</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <div style="max-width: 300px !important">
            <v-text-field
              dense
              v-model="search"
              append-icon="mdi-magnify"
              outlined
              :label="$t('market_search_bar_placeholder')"
              hide-details
            ></v-text-field>
          </div>
        </v-toolbar>
      </template>
      <template v-slot:[`item.dest_amount`]="{ item }">
        <span>{{
          `${
            item.dest_amount
              ? new Intl.NumberFormat().format(item.dest_amount.toFixed(4))
              : ""
          } ${item.dest_currency.symbol}`
        }}</span>
      </template>
      <template v-slot:[`item.source_amount`]="{ item }">
        <span>{{
          `${new Intl.NumberFormat().format(item.source_amount)} ${
            item.source_currency.symbol
          }`
        }}</span>
      </template>
      <template v-slot:[`item.current_cost`]="{ item }">
        <span>{{
          `${new Intl.NumberFormat().format(item.current_cost)} ${
            item.source_currency.symbol
          }`
        }}</span>
      </template>
      <template v-slot:[`item.difference`]="{ item }">
        <span :style="diffColor(item.difference)">{{
          new Intl.NumberFormat().format(item.difference)
        }}</span>
      </template>
      <template v-slot:[`item.difference_perc`]="{ item }">
        <span :style="diffColor(item.difference)">{{
          item.difference_perc
        }}</span>
      </template>
    </v-data-table>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import config from "~/config/config.json";
const model = "data/trade";

export default {
  props: {
    prices: {
      type: Array,
      default: () => {
        return [];
      },
    },
    filter: null,
    page_size: {
      type: Number,
      default: 5,
    },
  },
  data() {
    return {
      start_blue_gradient: config.colors.start_blue_gradient,
      end_blue_gradient: config.colors.end_blue_gradient,
      start_red_gradient: config.colors.start_red_gradient,
      end_red_gradient: config.colors.end_red_gradient,
      page_size_current: this.page_size,
      search: "",
      list: [],
      interv: null,
      platform: "binance",
      totalLength: -1,
      config: this.f_definer(),
      loading: false,
    };
  },
  computed: {
    ...mapGetters(model, {
      trades: "list",
    }),
    customStyle() {
      return {
        "--start_blue_gradient": this.start_blue_gradient,
        "--end_blue_gradient": this.end_blue_gradient,
        "--start_red_gradient": this.start_red_gradient,
        "--end_red_gradient": this.end_red_gradient,
      };
    },
    headers() {
      return [
        {
          text: this.$t("Purchased"),
          value: "dest_amount",
        },
        {
          text: this.$t("Spent"),
          value: "source_amount",
        },
        {
          text: this.$t("table_time"),
          value: "created_at",
        },

        {
          text: this.$t("table_current_price"),
          value: "current_cost",
        },
        {
          text: this.$t("table_profit_loss"),
          value: "difference",
        },
        {
          text: `${this.$t("table_profit_loss")} %`,
          value: "difference_perc",
        },
      ];
    },
  },
  methods: {
    ...mapActions(model, {
      fetchList: "fetchList",
    }),
    f_definer() {
      let conf = null;
      if (this.filter) {
        conf = {
          params: {},
        };
        for (let i in this.filter) {
          conf.params[i] = this.filter[i];
        }
      }
      return conf;
    },
    async paging(val) {
      // console.log("paging", val);
      this.page_size_current = val.itemsPerPage;
      await this.rel(val);
    },
    async rel(v) {
      let val = v;
      if (!this.config || !this.config.params) {
        this.config = { params: {} };
      }
      this.config.params.page = val ? val.page : 1;
      this.config.params.per_page = this.page_size_current;
      this.loading = true;
      let res = await this.fetchList({ config: this.config });
      let meta = res.meta;
      this.totalLength = meta.total ? meta.total : res.data.length;
      setTimeout(() => {
        this.loading = false;
      }, 500);
    },
    resetList(prices) {
      this.list = this.trades.map((el) => {
        let fnd_b = prices.find((e) => e && e.base == el.dest_currency.symbol);
        let pr_b = 1;
        if (fnd_b && fnd_b.price) pr_b = fnd_b.price;
        let fnd_p = prices.find(
          (e) => e && e.base == el.source_currency.symbol
        );
        let pr_p = 1;
        if (fnd_p && fnd_p.price) pr_p = fnd_p.price;
        let curr_cost = (el.dest_amount * pr_b) / pr_p;
        el.current_cost = curr_cost.toFixed(4);
        let diff = curr_cost - el.source_amount;
        let diff_proc = (diff * 100) / el.source_amount;
        el.difference = diff.toFixed(4);
        el.difference_perc = `${diff_proc.toFixed(4)} %`;
        return el;
      });
    },
    reload() {
      this.resetList(this.prices);
    },
    diffColor(diff) {
      let nm = parseFloat(diff);
      if (nm < 0) {
        return `background: linear-gradient(176.35deg, ${this.start_red_gradient} 0.47%, ${this.end_red_gradient} 97%) !important;
        -webkit-background-clip: text !important;
        -webkit-text-fill-color: transparent !important;
        background-clip: text !important;
        text-fill-color: transparent !important;`;
      } else {
        return `background: linear-gradient(176.35deg, ${this.start_blue_gradient} 0.47%, ${this.end_blue_gradient} 97%) !important;
        -webkit-background-clip: text !important;
        -webkit-text-fill-color: transparent !important;
        background-clip: text !important;
        text-fill-color: transparent !important;`;
      }
    },
  },
  watch: {
    filter() {
      this.config = this.f_definer();
      this.rel();
    },
    prices() {
      this.resetList(this.prices);
    },
    trades() {
      this.resetList(this.prices);
    },
  },
  async created() {
    if (this.prices && this.prices.length > 0) {
      this.resetList(this.prices);
    }
  },
};
</script>
