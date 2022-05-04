<template>
  <div>
    <v-card class="check-card pa-3" elevation="1">
      <v-list-item three-line>
        <v-list-item-content>
          <v-row>
            <v-col col="10">
              <v-row class="">
                <v-col cols="12">
                  <p class="text-white--text">{{ $t("total_equity") }}</p>
                  <p class="text-h6">
                    <strong class="primary--text"
                      >{{
                        main_currency
                          ? new Intl.NumberFormat().format(totalEquity)
                          : new Intl.NumberFormat().format(total_equity_usdt)
                      }}
                      {{ main_currency ? "BTC" : "USD" }}</strong
                    >
                  </p>
                  <p class="text-white--text">
                    ≈
                    {{
                      main_currency
                        ? new Intl.NumberFormat().format(total_equity_usdt)
                        : new Intl.NumberFormat().format(totalEquity)
                    }}
                    {{ main_currency ? "USD" : "BTC" }}
                  </p>
                </v-col>
                <v-col cols="12">
                  <p class="text-white--text">{{ $t("available_balance") }}</p>
                  <p class="text-h6">
                    <strong class="primary--text"
                      >{{
                        main_currency
                          ? new Intl.NumberFormat().format(available_balance)
                          : new Intl.NumberFormat().format(
                              available_balance_usdt
                            )
                      }}
                      {{ main_currency ? "BTC" : "USD" }}</strong
                    >
                  </p>
                  <p class="text-white--text">
                    ≈
                    {{
                      main_currency
                        ? new Intl.NumberFormat().format(available_balance_usdt)
                        : new Intl.NumberFormat().format(available_balance)
                    }}
                    {{ main_currency ? "USD" : "BTC" }}
                  </p>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="2">
              <div>
                <v-btn
                  :class="
                    tgl ? 'historyChip primary' : 'historyChip primary--text'
                  "
                  @click="history_tgl"
                  outlined
                  x-small
                  ><div class="d-flex">
                    <v-icon x-small>mdi-history</v-icon
                    ><span class="history-btn-cl">{{
                      $t("history_button")
                    }}</span>
                  </div>
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-list-item-content>
      </v-list-item>
    </v-card>
  </div>
</template>

<script>
export default {
  props: [
    "title",
    "totalEquity",
    "available_balance",
    "available_balance_usdt",
    "available_balance_usdt",
    "total_equity_usdt",
    "main_currency",
  ],
  name: "GeneralCapital",
  data() {
    return {
      tgl: false,
    };
  },
  methods: {
    history_tgl() {
      this.tgl = !this.tgl;
      this.$emit("history", this.tgl);
    },
  },
};
</script>

<style scoped>
.history-btn-cl {
  font-size: 13px;
  padding-left: 5px;
}
.check-card {
  position: relative;
}
.historyChip {
  position: absolute;
  right: 5px;
  background: transparent !important;
  border-radius: 10px !important;
}
</style>
