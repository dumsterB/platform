<template>
  <div>
    <v-data-table
      :items="list"
      :headers="headers"
      :items-per-page="page_size_current"
      :search="search"
      sort-by="created_at"
      :sort-desc="true"
      class="elevation-1 ma-4 ml-8"
      :server-items-length="totalLength"
      @pagination="paging"
      :footer-props="{
        'items-per-page-options': [5, 10, 20, 50],
      }"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>{{ $t(title) }}</v-toolbar-title>
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
      <template v-slot:[`item.amount`]="{ item }">
        <span>{{
          new Intl.NumberFormat().format(item.amount) +
          " " +
          item.wallet.currency.symbol
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
      <template v-slot:[`item.action`]="{ item }">
        <v-row justify="center">
          <v-btn
            name="closeOrder"
            @click="toggleModal(item)"
            :style="customStyle"
            class="green_btn text-capitalize"
            :value="item.start_dt"
            :disabled="item.status.key != 'OPEN'"
          >
            {{ $t("close") }}
          </v-btn>
        </v-row>
      </template>
    </v-data-table>
    <v-dialog v-model="dialog" max-width="600px">
      <ClosePosition
        :item="selectedItem"
        :prices="prices"
        @close="dialog = false"
        @reload="reload"
      />
    </v-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import ClosePosition from "~/components/elements/modals/ClosePosition";
import config from "~/config/config.json";
const model = "data/arbitrage_session";

export default {
  components: {
    ClosePosition,
  },
  props: {
    prices: {
      type: Array,
      default: () => {
        return [];
      },
    },
    filter: null,
    title: "",
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
      dialog: false,
      page_size_current: this.page_size,
      search: "",
      selectedItem: null,
      list: [],
      interv: null,
      totalLength: -1,
      config: this.f_definer(),
      loading: false,
    };
  },
  computed: {
    customStyle() {
      return {
        "--start_blue_gradient": this.start_blue_gradient,
        "--end_blue_gradient": this.end_blue_gradient,
        "--start_red_gradient": this.start_red_gradient,
        "--end_red_gradient": this.end_red_gradient,
      };
    },
    ...mapGetters(model, {
      arbitrage_sessions: "list",
    }),
    headers() {
      return [
        {
          text: this.$t("name_table"),
          value: "arbitrage_company.name",
          // width: 80,
        },
        {
          text: this.$t("table_position"),
          value: "session_start_type.name",
          // width: 100,
        },
        {
          text: this.$t("table_time"),
          value: "created_at",
        },

        {
          text: this.$t("amount"),
          value: "amount",
          // width: 100,
        },
        {
          text: this.$t("table_buy_price"),
          value: "start_exchange_rate",
          // width: 120,
        },
        {
          text: this.$t("table_current_price"),
          value: "current_cost",
          // width: 130,
        },
        {
          text: `${this.$t("table_profit_loss")} $`,
          value: "difference",
          // width: 116,
        },
        {
          text: `${this.$t("table_profit_loss")} %`,
          value: "difference_perc",
          // width: 128,
        },
        {
          text: this.$t("table_close"),
          value: "action",
          // width: 80,
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
    toggleModal(item) {
      this.$emit("get_prices", item.wallet.currency);
      this.selectedItem = item;
      this.dialog = true;
    },
    resetList(prices) {
      let list = [];
      let as = [];
      as = this.arbitrage_sessions;
      as.forEach((element) => {
        let fnd = prices.find(
          (e) => e && e.base == element.wallet.currency.symbol
        );
        let pr = 1;
        if (fnd && fnd.price) {
          pr = fnd.price;
        }
        let diff;
        if (element.status.key == "CLOSED") {
          element.current_cost = element.stop_exchange_rate;
          diff = element.stop_exchange_rate - element.start_exchange_rate;
        } else {
          element.current_cost = pr;
          diff = pr - element.start_exchange_rate;
        }
        let diff_full = diff * element.amount;
        let diff_proc = (diff * 100) / element.start_exchange_rate;
        if (element.session_start_type.key == "SELL") {
          diff_full = -diff_full;
          diff_proc = -diff_proc;
        }
        element.difference = diff_full.toFixed(3);
        element.difference_perc = `${diff_proc.toFixed(3)} %`;
        list.push(element);
      });
      this.list = list;
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

    async reload() {
      await this.rel();
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
    prices() {
      // console.log("this.prices", this.prices);
      this.resetList(this.prices);
    },
    filter() {
      this.config = this.f_definer();
      this.rel();
    },
    arbitrage_sessions() {
      this.resetList(this.prices);
    },
  },
  async created() {
    // console.log("this.arbitrage_sessions", this.arbitrage_sessions);
  },
};
</script>

<style scoped lang="scss">
.green_btn {
  background: linear-gradient(
    163.28deg,
    var(--start_blue_gradient) 0%,
    var(--end_blue_gradient) 85.7%
  ) !important;
  color: white !important;
  border-radius: 20px !important;
}
</style>
