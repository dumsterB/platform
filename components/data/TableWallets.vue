<template>
  <div class="prod-table">
    <div class="d-flex" style="max-width: 500px !important; margin-top: -50px">
      <v-text-field
        dense
        v-model="search"
        append-icon="mdi-magnify"
        outlined
        :label="$t('market_search_bar_placeholder')"
        hide-details
      ></v-text-field>
      <v-checkbox
        class="ml-2"
        style="margin-top: -1px"
        label="Hide zero balances"
      ></v-checkbox>
    </div>
    <v-data-table
      :headers="headers"
      :items="wallets"
      :search="search"
      class="table mt-3 pa-2"
      @click:row="handleClick"
      :footer-props="{
        'items-per-page-options': [5, 10, 20, 50],
      }"
    >
      <template v-slot:[`item.eqv`]="{ item }">
        <span class="primary--text font-weight-bold">{{item.eqv}}</span><span class="primary--text"> USD</span>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn
          v-if="item.currency.currency_type.key == 'FIAT'"
          elevation="0"
          class="success_text--text"
          @click="depositChanger(item)"
          >{{ $t("deposit_title") }}</v-btn
        >
      </template>
      <template v-slot:no-data>
        <p>No data</p>
      </template>
    </v-data-table>
    <Deposit
      :dialog="dialog"
      @depositChanger="close"
      action="deposit_title"
      :wallet="sel_wallet"
    ></Deposit>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Deposit from "@/components/modals/Deposit";
export default {
  name: "TableTransactions",
  components: {
    Deposit,
  },
  props: {
    wallets: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      dialog: false,
      dialogDelete: false,
      search: "",
      desserts: [],
      editedIndex: -1,
      sel_wallet: null,
      sel_row: false,
      editedItem: {
        name: "",
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0,
      },
      defaultItem: {
        name: "",
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0,
      },
    };
  },
  computed: {
    headers() {
      return [
        {
          text: this.$t("coin_title"),
          align: "start",
          value: "currency.symbol",
        },
        { text: this.$t("wallet_balance"), value: "balance" },
        {
          text: this.$t("available_balance"),
          value: "balance",
        },
        { text: this.$t("equivalent") + " $", value: "eqv" },
        { text: this.$t("action_title"), value: "actions", sortable: false },
      ];
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },
  created() {},
  methods: {
    depositChanger(item) {
      this.sel_wallet = item;
      this.dialog = true;
      this.sel_row = true;
      setTimeout(() => {
        this.sel_row = false;
      }, 200);
    },
    close() {
      this.dialog = false;
      this.$emit("reload");
    },
    handleClick(value) {
      setTimeout(() => {
        if (!this.sel_row) {
          this.$router.push({
            path: `/currency?id=${value.currency_id}`,
          });
        }
      }, 100);
    },
  },
};
</script>

<style scoped>
.table {
  background: #000c19;
  box-shadow: 20px 20px 100px rgba(0, 0, 0, 0.07);
  border-radius: 20px;
}
.prod-table tr {
  cursor: pointer;
}
</style>
