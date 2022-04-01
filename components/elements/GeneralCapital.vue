<template>
  <div>
    <v-card
      class="mx-auto pa-3 gc-card"
      elevation="1"
      max-width="430"
    >
      <v-list-item three-line>
        <v-list-item-content>
          <v-list-item-title class="text-h5 mb-1">
            <strong>{{ $t('total_equity') }}</strong>
          </v-list-item-title>
          <br><br>
          <v-list-item-title class="text-h5 mb-1">
            <strong v-if="hideBalancer">{{total_sum_btc}} </strong>
            <strong v-if="!hideBalancer">******</strong> BTC
          </v-list-item-title>
          <p v-if="hideBalancer" class="mt-2 text-gray">≈ {{total_sum}} USD</p>
          <p v-if="!hideBalancer" class="mt-2 text-gray">******</p>
        </v-list-item-content>

        <v-icon v-if="!hideBalancer" @click="hideBalance">mdi-eye</v-icon>
        <v-icon v-if="hideBalancer" @click="hideBalance">mdi-eye-off</v-icon>
      </v-list-item>

      <v-card-actions class="justify-center">
        <v-btn
          elevation="0"
          large
          rounded
          class="success-btn-half mr-6"
          color="white"
          @click="depositChanger('deposit_title')"
        >
          {{ $t('deposit_title') }}
        </v-btn>
        <v-btn
          elevation="0"
          large
          rounded
          class="simple-btn-half"
          @click="depositChanger('withdraw')"
        >
          {{ $t('withdraw') }}
        </v-btn>
      </v-card-actions>
    </v-card>
    <Deposit :action="action" :dialog="dialog" @depositChanger="depositChanger"></Deposit>

  </div>
</template>

<script>
import Deposit from "@/components/modals/Deposit";
export default {
  name: "GeneralCapital",
  components:{
    Deposit
  },
  props: {
    total_sum_btc: "",
    total_sum: ""
  },
  data() {
    return {
      hideBalancer: false,
      dialog:false,
      action:''
    }
  },
  methods: {
    hideBalance() {
      this.hideBalancer = !this.hideBalancer
    },
    depositChanger(val){
      this.dialog=!this.dialog
      this.action=val
    }
  },
  watch:{
    dialog(newVal,oldVal){
      console.log(newVal,oldVal)
    }
  },
  mounted() {
    console.log(this.dialog)
  }
}
</script>

<style scoped>
.simple-btn-half {
  color: black;
  border-radius: 12px;
  border: 1px solid #23ad41;
  background: transparent;
  width: 150px;
}
.success-btn-half {
  background: linear-gradient(94.9deg, #2fed59 4.26%, #23ad41 95.87%);
  color: white !important;
  border-radius: 12px;
  width: 150px;
}
</style>
