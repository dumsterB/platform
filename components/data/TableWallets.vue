<template>
  <div class="prod-table">
    <v-card>
      <v-card-title class="pb-1">
        <div class="d-flex" style="width: 100%">
          <v-row>
          <v-col cols="12" md="6" lg="6">
            <div class="header-info">
              <h3 style="letter-spacing: -2px" class="mr-2 mt-2">
                {{ $t("my_wallet") }}
              </h3>
              <v-checkbox
                  v-model="zero_bals"
                  class="ml-2 mt-2 font-weight-regular"
                  :label="
              zero_bals ? $t('open_zero_balances') : $t('hide_zero_balances')
            "
              ></v-checkbox>
            </div>
          </v-col>
          <v-col cols="12" md="6" lg="6">
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            :label="$t('market_search_bar_placeholder')"
            outlined
            filled
            dense
            hide-details
            class="ml-4"
          ></v-text-field>
          </v-col>
          </v-row>
        </div>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="in_wallets"
        :search="search"
        class="wallet-table mt-2 pa-2"
        @click:row="handleClick"
        :style="customStyle"
        :footer-props="{
          'items-per-page-options': [5, 10, 20, 50],
          'items-per-page-text': $t('items_per_page'),
        }"
      >
        <template v-slot:[`item.currency.symbol`]="{ item }">
          <span class="gray--text font-weight-bold">{{
            item.currency.symbol
          }}</span>
        </template>
        <template v-slot:[`item.balance`]="{ item }">
          <span>{{ new Intl.NumberFormat().format(item.balance) }}</span>
        </template>

        <template v-slot:[`item.eqv`]="{ item }">
          <span class="primary--text font-weight-bold">{{
            new Intl.NumberFormat().format(item.eqv)
          }}</span
          ><span class="primary--text"> USD</span>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            v-if="item.currency.currency_type.key == 'FIAT'"
            elevation="0"
            class="primary"
            rounded
            block
            @click="depositChanger(item)"
            >{{ $t("deposit_title") }}</v-btn
          >
        </template>
        <template v-slot:no-data>
          <p>No data</p>
        </template>
      </v-data-table>
    </v-card>
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
import config from "~/config/config.json";
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
      primary: config.colors.text.primary,
      dialog: false,
      dialogDelete: false,
      search: "",
      desserts: [],
      editedIndex: -1,
      sel_wallet: null,
      sel_row: false,
      zero_bals: false,
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
    in_wallets() {
      if (this.zero_bals) {
        return this.wallets.filter((el) => el.balance);
      } else {
        return this.wallets;
      }
    },
    customStyle() {
      return {
        "--primary": this.primary,
      };
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

<style scoped lang="scss">
.wallet-table {
  background: #000c19;
  box-shadow: 20px 20px 100px rgba(0, 0, 0, 0.07);
  border-radius: 20px;
  width: 100%;
}
.prod-table tr {
  cursor: pointer;
}
.header-info{
  display: flex;
}
@media (max-width: 1000px) {
  .header-info{
    display: block;
  }
}
</style>
