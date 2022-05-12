<template>
  <div>
    <v-card>
      <v-card-title class="cardTitle pb-1"
        >{{ $t("last_deposits") }}:</v-card-title
      >
      <v-data-table
        :headers="headers"
        :items="deposits"
        class="wallet-table mt-2 pa-2"
        :style="customStyle"
        :footer-props="{
          'items-per-page-options': [10, 20, 30, -1],
          'items-per-page-text': $t('items_per_page'),
        }"
      >
        <template v-slot:no-data>
          <p>{{ $t("no_records_found") }}</p>
        </template>
      </v-data-table>
    </v-card>
    <Deposit
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import config from "~/config/config.json";
export default {
  name: "TableLastDeposits",
  data() {
    return {
      primary: config.colors.text.primary,
      deposits: [],
    };
  },
  computed: {
    headers() {
      return [
        {
          text: this.$t("time_title"),
          value: "",
          sortable: false,
          align: "center",
        },
        {
          text: this.$t("amount"),
          value: "",
          sortable: false,
          align: "center",
        },
        {
          text: this.$t("currency"),
          value: "",
          sortable: false,
          align: "center",
        },
        { text: this.$t("info"), value: "", sortable: false, align: "center" },
        {
          text: this.$t("status_title"),
          value: "",
          sortable: false,
          align: "center",
        },
      ];
    },

    customStyle() {
      return {
        "--primary": this.primary,
      };
    },
  },

  watch: {},
  created() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
.v-card {
  background: transparent !important;
  border: none !important;
}
:not(.curr-table).v-data-table.wallet-table {
  background: transparent !important;
}
.v-application--is-ltr .v-data-footer__pagination {
  display: none !important;
}
.cardTitle {
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
}
</style>
