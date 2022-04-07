<template>
  <div>
    <v-card class="mx-auto check-card pa-3" max-width="430" elevation="1">
      <v-list-item three-line>
        <v-list-item-content>
          <div class="d-flex">
            <v-list-item-title class="text-h5 mb-1">
              <strong>{{ title }}</strong>
            </v-list-item-title>
            <v-btn
              rounded
              outlined
              :class="tgl ? 'historyChip primary white--text' : 'historyChip'"
              x-small
              @click="history_tgl"
              ><div>
                <v-icon x-small>mdi-history</v-icon
                ><span class="history-btn-cl">{{ $t("history_button") }}</span>
              </div>
            </v-btn>
          </div>

          <br /><br />
          <v-row class="mt-10">
            <v-col>
              <p class="text-gray--text">{{ $t("total_equity") }}</p>
              <p class="text-h6">
                <strong
                  >{{ main_currency ? totalEquity : total_equity_usdt }}
                  {{ main_currency ? "BTC" : "USD" }}</strong
                >
              </p>
              <p class="text-gray--text">
                ≈ {{ main_currency ? total_equity_usdt : totalEquity }}
                {{ main_currency ? "USD" : "BTC" }}
              </p>
            </v-col>
            <v-col>
              <p class="text-gray--text">{{ $t("available_balance") }}</p>
              <p class="text-h6">
                <strong
                  >{{
                    main_currency ? available_balance : available_balance_usdt
                  }}
                  {{ main_currency ? "BTC" : "USD" }}</strong
                >
              </p>
              <p class="text-gray-text">
                ≈
                {{ main_currency ? available_balance_usdt : available_balance }}
                {{ main_currency ? "USD" : "BTC" }}
              </p>
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
  font-size: 12px;
  padding-left: 5px;
}
.check-card {
  position: relative;
}
.historyChip {
  position: absolute;
  right: 5px;
}
</style>
