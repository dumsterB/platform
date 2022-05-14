<template>
  <div>
    <v-data-table
      :items="list"
      :headers="headers"
      :items-per-page="page_size_current"
      :search="search_text"
      :loading="loading"
      class="elevation-1 ma-4"
      :style="customStyle"
      :footer-props="{
        'items-per-page-options': [5, 10, 20, 50],
        'items-per-page-text': $t('items_per_page'),
      }"
    >
      <template v-slot:top>
        <v-toolbar extended flat class="borderNone">
          <v-toolbar-title class="font-weight-bold">{{
            $t(title)
          }}</v-toolbar-title>
          <v-divider v-if="title" class="mx-4" inset vertical></v-divider>
          <slot name="header"></slot>
          <v-spacer></v-spacer>
          <div style="max-width: 300px !important">
            <v-text-field
              dense
              v-model="search_text"
              @click:append-outer="search"
              @click:clear="search('clear')"
              @keydown.enter="search"
              clearable
              append-icon="mdi-magnify"
              outlined
              :label="$t('market_search_bar_placeholder')"
              hide-details
            ></v-text-field>
          </div>
          <template v-slot:extension><slot name="header_ext"></slot></template>
        </v-toolbar>
      </template>
      <template v-slot:[`item.updated_at`]="{ item }">
        <span>{{ new Date(item.updated_at).toLocaleString() }}</span>
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
      <template v-slot:[`item.exchange_rate`]="{ item }">
        <span>{{
          `${new Intl.NumberFormat().format(item.exchange_rate)} USD`
        }}</span>
      </template>
      <template v-slot:[`item.price`]="{ item }">
        <span>{{ `${new Intl.NumberFormat().format(item.price)} USD` }}</span>
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
            :disabled="item.trade_status.key != 'OPEN'"
          >
            {{ $t("close") }}
          </v-btn>
        </v-row>
      </template>
    </v-data-table>
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title class="d-flex">
          <span class="text-h5">{{ $t("close_order") }}</span>
        </v-card-title>
        <v-card-text>
          <v-container v-if="close_item">
            <p>
              {{ "Current price:" }}
              <span class="font-weight-bold"
                >${{ new Intl.NumberFormat().format(close_item.price) }}</span
              >
            </p>
            <p>
              {{ "Your limit price:" }}
              <span class="font-weight-bold"
                >${{ new Intl.NumberFormat().format(def_limit_price) }}</span
              >
            </p>
          </v-container>
        </v-card-text>
        <v-card-actions class="mr-4 pb-4">
          <v-spacer></v-spacer>
          <v-btn class="green--text" outlined text @click="dialog = false">
            {{ $t("go_back") }}
          </v-btn>
          <v-btn
            class="green"
            text
            outlined
            width="100"
            :loading="loading_modal"
            @click="run_close"
            type="submit"
          >
            {{ loading_modal ? "" : $t("ok") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
    title: {
      type: String,
      default: "",
    },
    add_cols: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      primary: config.colors.text.primary,
      blue: config.colors.text.blue,
      red: config.colors.text.red,
      start_blue_gradient: config.colors.start_blue_gradient,
      end_blue_gradient: config.colors.end_blue_gradient,
      blue: config.colors.text.blue,
      red: config.colors.text.red,
      dark_disabled: config.colors.dark_disabled_primary_btn,
      light_disabled: config.colors.light_disabled_primary_btn,
      page_size_current: this.page_size,
      search_text: "",
      list: [],
      interv: null,
      platform: "binance",
      totalLength: -1,
      config: this.f_definer(),
      loading: false,
      page: 1,
      dialog: false,
      close_item: null,
      loading_modal: false,
    };
  },
  computed: {
    ...mapGetters(model, {
      trades: "list",
    }),
    ...mapGetters("config/default", {
      get_val: "get_val",
    }),
    customStyle() {
      return {
        "--primary": this.primary,
        "--start_blue_gradient": this.start_blue_gradient,
        "--end_blue_gradient": this.end_blue_gradient,
        "--dark_disabled": this.dark_disabled,
        "--light_disabled": this.light_disabled,
      };
    },
    def_limit_price() {
      return this.close_item.exchange_rate;
    },
    headers() {
      let add_cols = [
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
          width: 150,
        },
      ]
      let res_cols = [
        {
          text: this.$t("id"),
          value: "identifier",
        },
        {
          text: this.$t("currency"),
          value: "symbol",
        },
        {
          text: this.$t("table_position"),
          value: "type",
          sortable: false,
        },
        {
          text: this.$t("table_time"),
          value: "updated_at",
        },
        {
          text: this.$t("amount"),
          value: "amount",
        },
        {
          text: this.$t("limit"),
          value: "exchange_rate",
        },
        {
          text: this.$t("table_current_price"),
          value: "price",
        },
      ];
      if (this.add_cols) {
        res_cols = res_cols.concat(add_cols);
      }
      return res_cols;
    },
  },
  methods: {
    ...mapActions(model, {
      fetchList: "fetchList",
    }),
    ...mapActions("data/wallet", {
      fetchWallet: "fetchList",
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
    async search(pr) {
      this.config.params["search"] = this.search_text;
      if (pr == "clear") {
        delete this.config.params["search"];
      }
      this.page_to_1();
      this.loading = true;
      let res = await this.fetchList({ config: this.config });
      let meta = res.meta;
      this.totalLength = meta.total ? meta.total : res.data.length;
      setTimeout(() => {
        this.loading = false;
      }, 500);
    },
    page_to_1() {
      if (this.config && this.config.params) {
        this.config.params.page = 1;
      }
      this.page = 1;
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
      this.page_to_1();
      this.loading = true;
      let res = await this.fetchList({ config: this.config });
      let meta = res.meta;
      this.totalLength = meta.total ? meta.total : res.data.length;
      setTimeout(() => {
        this.loading = false;
      }, 500);
    },
    async paging(val) {
      this.page_size_current = val.itemsPerPage;
      await this.rel(val);
    },
    async rel(v) {
      let val = v;
      if (!this.config || !this.config.params) {
        this.config = { params: {} };
      }
      // this.config.params.page = val ? val.page : 1;
      // this.config.params.per_page = this.page_size_current;
      this.config.params.sort = "updated_at";
      this.config.params.dir = "desc";
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
        let symb = el.symbol;
        if (el.symbol == 'USD') {
          symb = el.source_currency.symbol;
        }
        let fnd_p = prices.find(
          (e) => e && e.base == symb
        );
        let price = fnd_p ? fnd_p.price : null;
        if (!price) {
          price = this.get_val(symb);
        }
        el.amount = `${el.source_amount} ${el.source_currency.symbol}`;
        el.type = !el.trade_type ? "Sell" : "Buy";
        el.price = price;
        let diff = el.price - el.exchange_rate;
        let diff_proc = (diff * 100) / el.price;
        el.difference = diff.toFixed(5);
        el.difference_perc = `${diff_proc.toFixed(3)} %`;
        return el;
      });
    },
    async reload() {
      await this.rel();
      if (this.prices && this.prices.length > 0) {
        this.resetList(this.prices);
      }
    },
    diffColor(diff) {
      let nm = parseFloat(diff);
      if (nm < 0) {
        return `color: ${this.red} !important;`;
      } else {
        return `color: ${this.blue} !important;`;
      }
    },
    toggleModal(item) {
      this.close_item = item;
      this.dialog = true;
    },
    async run_close() {
      this.loading_modal = true;
      let trade_data = {};
      trade_data.source_amount = this.close_item.source_amount;
      trade_data.dest_amount = this.close_item.dest_amount;
      trade_data.source_currency_id = this.close_item.source_currency_id;
      trade_data.dest_currency_id = this.close_item.dest_currency_id;
      trade_data.id = this.close_item.id;
      trade_data.trade_status_id = 10;
      let rs = await this.$store.dispatch(`data/trade/replace`, {
        data: trade_data,
        id: trade_data.id,
      });
      let title, color;
      title = this.$t("stop_trade");
      color = "warning";
      setTimeout(() => {
        this.$store.commit("data/notifications/create", {
          id: color + "_" + Math.random().toString(36),
          title: this.$t("stop_trade_done"),
          text: this.$t("stop_trade_done"),
          color: "primary",
        });
      }, 2500);
      this.$store.commit("data/notifications/create", {
        id: color + "_" + Math.random().toString(36),
        title: title,
        text: title,
        color: color,
        timeout: 2000,
      });
      await this.fetchWallet();
      this.resetList(this.prices);
      setTimeout(() => {
        this.loading_modal = false;
        this.dialog = false;
      }, 500);
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
    await this.reload();
  },
};
</script>
<style lang="scss">
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
