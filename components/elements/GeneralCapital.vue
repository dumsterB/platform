<template>
  <div>
    <v-card class="pa-6 gc-card" elevation="1">
      <v-list-item three-line class="pa-0">
        <v-list-item-content class="pa-0">
          <v-list-item-title class="mb-4">
            <strong>{{ $t("total_equity") }}</strong>
          </v-list-item-title>
          <br /><br />
          <v-list-item-title class="text-h5 mb-2">
            <strong class="font-weight-bold" v-if="hideBalancer"
              >{{
                total_sum ? new Intl.NumberFormat().format(total_sum_btc) : 0
              }}
            </strong>
            <strong class="font-weight-bold" v-if="!hideBalancer"
              >******</strong
            >
            BTC
          </v-list-item-title>
          <p v-if="hideBalancer" class="mb-6 text-gray--text">
            ≈
            {{ total_sum ? new Intl.NumberFormat().format(total_sum) : 0 }} USD
          </p>
          <p v-if="!hideBalancer" class="mb-6 text-gray--text">******</p>
        </v-list-item-content>

        <v-icon v-if="!hideBalancer" @click="hideBalance">mdi-eye</v-icon>
        <v-icon class="primary--text" v-if="hideBalancer" @click="hideBalance"
          >mdi-eye-off</v-icon
        >
      </v-list-item>

      <v-card-actions class="justify-space-between pa-0">
        <v-btn
          elevation="0"
          large
          class="outlined-btn mainBorderRadius"
          height="42"
          :style="customStyle"
          color="white"
          @click="depositChanger('deposit_title')"
        >
          {{ $t("deposit_title") }}
        </v-btn>
        <v-btn
          elevation="0"
          large
          :style="customStyle"
          class="success-btn-half mainBorderRadius ma-0"
          height="42"
          @click="depositChanger('withdraw')"
        >
          {{ $t("withdraw") }}
        </v-btn>
      </v-card-actions>
    </v-card>
    <Deposit
      :action="action"
      :dialog="dialog"
      @depositChanger="depositChanger"
    ></Deposit>
  </div>
</template>

<script>
import Deposit from "@/components/modals/Deposit";
import config from "~/config/config.json";
export default {
  name: "GeneralCapital",
  components: {
    Deposit,
  },
  props: {
    total_sum_btc: "",
    total_sum: "",
  },
  data() {
    return {
      primary: config.colors.text.primary,
      hideBalancer: false,
      dialog: false,
      action: "",
    };
  },
  computed: {
    customStyle() {
      return {
        "--primary": this.primary,
      };
    },
  },
  methods: {
    hideBalance() {
      this.hideBalancer = !this.hideBalancer;
    },
    depositChanger(val) {
      this.dialog = !this.dialog;
      this.action = val;
    },
  },
  watch: {
    dialog(newVal, oldVal) {
      // console.log(newVal, oldVal);
    },
  },
  mounted() {
    // console.log(this.dialog);
  },
};
</script>

<style scoped lang="scss">
.outlined-btn {
  background: transparent !important;
  border: solid 2px var(--primary) !important;
  color: var(--primary);
  border-radius: 10px;
  width: 49%;
}
.success-btn-half {
  background: var(--primary) !important;
  border: solid 2px var(--primary) !important;
  color: white !important;
  border-radius: 10px;
  width: 49%;
}
</style>
