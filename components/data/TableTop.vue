<template>
  <div class="tt-comp">
    <v-data-table
      :items="currencies"
      :headers="headers"
      :items-per-page="20"
      class="ma-4 ml-8 curr-table"
      :style="customStyle"
      :footer-props="{
        'items-per-page-options': [5, 10, 20, 50],
        'items-per-page-text': $t('items_per_page'),
      }"
    >
      <template v-slot:[`item.name`]="{ item }">
        <div class="d-flex">
          <img height="20" :src="item.logo" alt="" />
          <div
            class="d-flex ml-3"
            @click="
              $router.push({
                path: `/currency?id=${item.id}`,
              })
            "
            style="cursor: pointer"
          >
            <strong>{{ item.name }}</strong>
            <span class="ml-2" style="color: #bfb5ff"> {{ item.symbol }}</span>
          </div>
        </div>
      </template>
      <template v-slot:[`item.percent`]="{ item }">
        <div class="" v-if="item.change && item.price">
          <span style="font-size: 14px"
            >${{ new Intl.NumberFormat().format(item.price) }}</span
          >
          <span
            style="font-size: 10px"
            :class="diffColor(item.change)"
            class="d-flex"
          >
            <v-icon :class="diffColor(item.change)" size="small">{{
              item.change > 0 ? "mdi-chevron-up" : "mdi-chevron-down"
            }}</v-icon>
            {{ new Intl.NumberFormat().format(item.change) }}
            <span style="font-size: 8px; margin-left: 3px; margin-top: 2px"
              >(%{{ item.percent }})</span
            >
          </span>
        </div>
        <div v-else>
          {{ $t("no-data") }}
        </div>
      </template>
      <template v-slot:[`item.action`]="{ item }">
        <div class="d-flex">
          <v-btn
            class="primary mainBorderRadius"
            small
            elevation="0"
            @click="
              $router.push({
                path: `/currency?id=${item.id}`,
              })
            "
            >{{ $t("buy") }}</v-btn
          >
        </div>
      </template>
      <template v-slot:[`item.chart`]="{}">
        <div class="d-flex">
          <v-sparkline
            :value="value"
            color="#BA68C8"
            height="100"
            padding="10"
            stroke-linecap="round"
            smooth
          >
          </v-sparkline>
        </div>
      </template>
      <template v-slot:[`item.volume`]="{ item }">
        <div class="ml-4" v-if="item.change && item.price">
          <span style="font-size: 14px"
            >${{ new Intl.NumberFormat().format(item.price) }}</span
          >
          <span
            style="font-size: 10px"
            :class="diffColor(item.change)"
            class="d-flex"
          >
            <v-icon :class="diffColor(item.change)" size="small">{{
              item.change > 0 ? "mdi-chevron-up" : "mdi-chevron-down"
            }}</v-icon>
            <!-- {{ item.change }} -->
            <span style="font-size: 8px; margin-left: 3px; margin-top: 2px"
              >(%{{ item.percent }})</span
            >
          </span>
        </div>
        <div v-else class="ml-4">
          {{ $t("no-data") }}
        </div>
      </template>
      <template v-slot:[`item.cap`]="{ item }">
        <div class="" v-if="item.change && item.price">
          <span style="font-size: 14px"
            >${{ new Intl.NumberFormat().format(item.price) }}</span
          >
          <span
            style="font-size: 10px"
            :class="diffColor(item.change)"
            class="d-flex"
          >
            <v-icon :class="diffColor(item.change)" size="small">{{
              item.change > 0 ? "mdi-chevron-up" : "mdi-chevron-down"
            }}</v-icon>
            {{ new Intl.NumberFormat().format(item.change) }}
            <span style="font-size: 8px; margin-left: 3px; margin-top: 2px"
              >(%{{ item.percent }})</span
            >
          </span>
        </div>
        <div v-else>
          {{ $t("no-data") }}
        </div>
      </template>
    </v-data-table>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import sparklines from "@/components/elements/currencies/Sparklines.vue";
import config from "~/config/config.json";
export default {
  props: {
    price: {},
  },
  components: {
    sparklines,
  },
  data() {
    return {
      primary: config.colors.text.primary,
      list: [],
      value: [423, 446, 975, 510, 990, 610, 860],
    };
  },
  methods: {
    diffColor(el) {
      if (el < 0) {
        return "red--text";
      } else {
        return "primary--text";
      }
    }
  },
  computed: {
    ...mapGetters("data/currency", {
      currencies_full: "list",
    }),
    currencies() {
      let currency_full = this.currencies_full.filter(
        (item) => item.currency_type && item.currency_type.key === "CRYPTO"
      );
      currency_full = currency_full.map((el) => {
        let determine = this.price.find((ell) => ell.base == el.symbol);
        if (determine) {
          let percent = (
            (parseFloat(determine.change) * 100) /
            parseFloat(determine.price)
          ).toFixed(2);
          el.price = determine.price;
          el.change = determine.change;
          el.percent = percent;
        }
        return el;
      });
      currency_full = currency_full.filter((el) => {
        return el.price;
      });
      return currency_full;
    },
    headers() {
      return [
        {
          text: this.$t("markets"),
          value: "name",
          width: 250,
        },
        {
          text: this.$t("change"),
          value: "percent",
          width: 140,
          align: "start",
        },
        {
          text: "24H Chart",
          align: "start",
          sortable: false,
          value: "chart",
        },
        { text: "24H Volume", value: "volume", sortable: false },
        { text: "Market Cap", value: "cap", sortable: false },
        { text: "Invest", value: "action", sortable: false },
      ];
    },
    customStyle() {
      return {
        "--primary": this.primary,
      };
    },
  },
  mounted() {},
};
</script>
<style>
.curr-table {
  background-color: transparent !important;
}
.tt-comp .v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
  padding: 0 10px !important;
}
</style>
