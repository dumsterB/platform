<template>
  <div>
    <v-card class="pa-3 gc-card" elevation="1">
      <v-list-item three-line>
        <v-list-item-content>
          <v-list-item-title class="text-h5 mb-1">
            <strong>{{ $t("total_equity") }}</strong>
          </v-list-item-title>
          <br /><br />
          <v-list-item-title class="text-h5 mb-1">
            <strong v-if="hideBalancer"
              >{{
                total_sum ? new Intl.NumberFormat().format(total_sum_btc) : 0
              }}
            </strong>
            <strong v-if="!hideBalancer">******</strong> BTC
          </v-list-item-title>
          <p v-if="hideBalancer" class="mt-2 text-gray--text">
            ≈
            {{ total_sum ? new Intl.NumberFormat().format(total_sum) : 0 }} USD
          </p>
          <p v-if="!hideBalancer" class="mt-2 text-gray--text">******</p>
        </v-list-item-content>

        <v-icon v-if="!hideBalancer" @click="hideBalance">mdi-eye</v-icon>
        <v-icon class="primary--text" v-if="hideBalancer" @click="hideBalance"
          >mdi-eye-off</v-icon
        >
      </v-list-item>

      <v-card-actions class="justify-center">
        <v-btn
          elevation="0"
          large
          rounded
          class="outlined-btn button_media mr-6"
          :style="customStyle"
          color="white"
          @click="depositChanger('deposit_title')"
        >
          {{ $t("deposit_title") }}
        </v-btn>
        <v-btn
          elevation="0"
          large
          rounded
          :style="customStyle"
          class="success-btn-half button_media"
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
  border-radius: 16px;
  width: 150px;
}
.success-btn-half {
  background: var(--primary) !important;
  border: solid 2px var(--primary) !important;
  color: white !important;
  border-radius: 16px;
  width: 150px;
}
@media (max-width: 1000px) {
  .gc-card{
    width: 280px!important;
  }
  .button_media{
    width: 110px;
  }
}
</style>
