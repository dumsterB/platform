<template>
  <div>
    <v-data-table
      :items="orders"
      :headers="headers"
      :items-per-page="page_size_current"
      :search="search"
      class="elevation-1 ma-3 mr-4"
      :loading="loading"
      :server-items-length="totalLength"
      @pagination="paging"
      :style="customStyle"
      :footer-props="{
        'items-per-page-options': [5, 10, 20, 50],
        'items-per-page-text': $t('items_per_page'),
      }"
    >
      <template v-slot:top>
        <v-toolbar flat class="borderNone">
          <v-toolbar-title class="font-weight-bold">{{
            `${$t("deposit")}, ${$t("withdraw")}`
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
          `${new Intl.NumberFormat().format(item.dest_amount)} ${
            item.dest_currency.symbol
          }`
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
        <span :style="diffColor(item.difference)">{{ item.difference }}</span>
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
const model = "data/order";

export default {
  props: {
    page_size: {
      type: Number,
      default: 5,
    },
    filter: null,
  },
  data() {
    return {
      start_blue_gradient: config.colors.start_blue_gradient,
      end_blue_gradient: config.colors.end_blue_gradient,
      start_red_gradient: config.colors.start_red_gradient,
      end_red_gradient: config.colors.end_red_gradient,
      primary: config.colors.text.primary,
      blue: config.colors.text.blue,
      red: config.colors.text.red,
      page_size_current: this.page_size,
      search: "",
      totalLength: -1,
      config: this.f_definer(),
      loading: false,
    };
  },
  computed: {
    ...mapGetters(model, {
      orders: "list",
    }),
    customStyle() {
      return {
        "--start_blue_gradient": this.start_blue_gradient,
        "--end_blue_gradient": this.end_blue_gradient,
        "--start_red_gradient": this.start_red_gradient,
        "--end_red_gradient": this.end_red_gradient,
        "--primary": this.primary,
      };
    },
    headers() {
      return [
        {
          text: this.$t("amount"),
          value: "dest_amount",
        },
        {
          text: this.$t("table_time"),
          value: "created_at",
        },
        {
          text: this.$t("status_title"),
          value: "order_status.name",
        },
        {
          text: this.$t("type_title_table"),
          value: "order_type.name",
        },
        {
          text: this.$t("Method"),
          value: "order_method.name",
        },
      ];
    },
  },
  watch: {
    filter() {
      this.config = this.f_definer();
      this.rel();
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
      this.config.params.sort = 'updated_at';
      this.config.params.dir = 'desc';
      this.loading = true;
      let res = await this.fetchList({ config: this.config });
      let meta = res.meta;
      this.totalLength = meta.total ? meta.total : res.data.length;
      setTimeout(() => {
        this.loading = false;
      }, 500);
    },
    diffColor(diff) {
      let nm = parseFloat(diff);
      if (nm < 0) {
        return `color: ${this.red} !important;`;
      } else {
        return `color: ${this.blue} !important;`;
      }
    },
  },
  async created() {
    await this.rel();
  },
};
</script>
