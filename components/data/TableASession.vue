<template>
  <div>
    <v-data-table
      :items="list"
      :headers="headers"
      :items-per-page="page_size_current"
      :search="search"
      :loading="loading"
      class="elevation-1 ma-4 mr-1"
      :style="customStyle"
      :footer-props="{
        'items-per-page-options': [5, 10, 20, 50],
        'items-per-page-text': $t('items_per_page'),
      }"
    >
      <template v-slot:top>
        <v-toolbar flat class="borderNone">
          <!-- <v-toolbar-title class="font-weight-bold">{{
            $t(title)
          }}</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider> -->
          <slot name="header"></slot>
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
      <template v-slot:[`item.arbitrage_company.logo`]="{ item }">
        <img
          :src="item.arbitrage_company.logo"
          :alt="item.arbitrage_company.name"
          height="20"
        />
      </template>
      <template v-slot:[`item.session_start_type.name`]="{ item }">
        <span :style="diffAction(item.session_start_type.name)">{{
          item.session_start_type.name
        }}</span>
      </template>
      <template v-slot:[`item.created_at`]="{ item }">
        <span>{{ new Date(item.created_at).toLocaleString() }}</span>
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
      blue: config.colors.text.blue,
      red: config.colors.text.red,
      dark_disabled: config.colors.dark_disabled_primary_btn,
      light_disabled: config.colors.light_disabled_primary_btn,
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
        "--dark_disabled": this.dark_disabled,
        "--light_disabled": this.light_disabled,
      };
    },
    ...mapGetters(model, {
      arbitrage_sessions: "list",
    }),
    headers() {
      return [
        {
          text: this.$t("id"),
          value: "identifier",
        },
        {
          text: this.$t("name_table"),
          value: "arbitrage_company.logo",
          sortable: false,
        },
        {
          text: this.$t("table_position"),
          value: "session_start_type.name",
          sortable: false,
        },
        {
          text: this.$t("table_time"),
          value: "created_at",
        },

        {
          text: this.$t("amount"),
          value: "amount",
        },
        {
          text: this.$t("table_buy_price"),
          value: "start_exchange_rate",
        },
        {
          text: this.$t("table_current_price"),
          value: "current_cost",
        },
        {
          text: `${this.$t("table_profit_loss")} $`,
          value: "difference",
        },
        {
          text: `${this.$t("table_profit_loss")} %`,
          value: "difference_perc",
        },
        {
          text: this.$t("table_close"),
          value: "action",
          sortable: false,
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
        element.difference = diff_full.toFixed(5);
        element.difference_perc = `${diff_proc.toFixed(3)} %`;
        list.push(element);
      });
      this.list = list;
    },
    async paging(val) {
      this.page_size_current = val.itemsPerPage;
      await this.rel(val);
    },
    async custom_sort(items) {
      if (typeof items == "boolean") {
        this.config.params.dir = items ? "desc" : "asc";
      } else {
        console.log(items, this.config.params.sort);
        if (this.config.params.sort && items == this.config.params.sort) {
          return;
        }
        if (items) {
          this.config.params.sort = items;
          this.config.params.dir = "asc";
        }
      }
      this.loading = true;
      let res = await this.fetchList({ config: this.config });
      let meta = res.meta;
      this.totalLength = meta.total ? meta.total : res.data.length;
      setTimeout(() => {
        this.loading = false;
      }, 500);
    },
    async rel(v) {
      let val = v;
      if (!this.config || !this.config.params) {
        this.config = { params: {} };
      }
      // this.config.params.page = val ? val.page : 1;
      // this.config.params.per_page = this.page_size_current;
      this.config.params.sort = "created_at";
      this.config.params.dir = "desc";
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
        return `color: ${this.red} !important;`;
      } else {
        return `color: ${this.blue} !important;`;
      }
    },
    diffAction(diff) {
      if (diff === "Sell") {
        return `color: ${this.red} !important;`;
      } else {
        return `color: ${this.blue} !important;`;
      }
    },
  },
  watch: {
    prices() {
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
    await this.reload();
    // console.log("this.arbitrage_sessions", this.arbitrage_sessions);
  },
};
</script>

<style scoped lang="scss">
html[theme="dark"] {
  .green_btn {
    width: 100%;
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
}
html[theme="light"] {
  .green_btn {
    width: 100%;
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
}
</style>
