<template>
  <v-container class="container_indicator mt-1">
    <v-row>
      <v-col :cols="3" style="text-align: center" class="pt-0 pb-0">
        <p class="ma-0 pa-0 gray--text" style="font-size: 12px">
          {{ indicators[0].title }}
        </p>
        <p class="ma-0 pa-0 font-weight-bold" :class="diffColor(change)">
          {{ price ? new Intl.NumberFormat().format(price) : "0" }}
        </p>
      </v-col>
      <v-col :cols="3" style="text-align: center" class="pa-0">
        <p class="ma-0 pa-0 gray--text" style="font-size: 12px">
          {{ indicators[1].title }}
        </p>
        <p class="ma-0 pa-0 font-weight-bold" :class="diffColor(change)">
          {{ change ? new Intl.NumberFormat().format(change) : "0" }}
        </p>
      </v-col>
      <v-col :cols="3" style="text-align: center" class="pa-0">
        <p class="ma-0 pa-0 gray--text" style="font-size: 12px">
          {{ indicators[2].title }}
        </p>
        <p class="ma-0 pa-0 font-weight-bold" :class="diffColor(change)">
          {{ high ? new Intl.NumberFormat().format(high) : "0" }}
        </p>
      </v-col>
      <v-col :cols="3" style="text-align: center" class="pa-0">
        <p class="ma-0 pa-0 gray--text" style="font-size: 12px">
          {{ indicators[3].title }}
        </p>
        <p class="ma-0 pa-0 font-weight-bold" :class="diffColor(change)">
          {{ low ? new Intl.NumberFormat().format(low) : "0" }}
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: {
    currency: {
      type: String,
      default: "BTC",
    },
    price: 0,
    change: 0,
    low: 0,
    high: 0,
  },
  data() {
    return {
      indicators: [
        {
          title: "Current",
        },
        {
          title: "24H Change",
        },
        {
          title: "24H High",
        },
        {
          title: "24H Low",
        },
        {
          title: "24H Turnover(USD)",
        },
        {
          title: "24H Volume(BTC)",
        },
      ],
    };
  },
  methods: {
    diffColor(diff) {
      let nm = parseFloat(diff);
      if (nm < 0) {
        return "red--text";
      } else {
        return "primary--text";
      }
    },
  },
  watch: {
    currency() {
      let me = this;
      // console.log("this.currency", this.currency);
      let socket = global.socket;
      // socket.send(`{
      //     "method": "subscribe",
      //     "data": ["binance_${me.currency}-USD@ticker_5s"]
      //   }`);
      // socket.onmessage = function (event) {
      //   if (event.data) {
      //     let json_d = JSON.parse(event.data);
      //     if (
      //       json_d &&
      //       json_d.method == `binance_${me.currency}-USD@ticker_5s`
      //     ) {
      //       let data = json_d.data ? json_d.data.data || [] : [];
      //       if (data && data[0] && data[0].price) {
      //         me.indicators[0].value = parseFloat(data[0].price);
      //         me.indicators[1].value = parseFloat(data[0].change);
      //       }
      //     }
      //     me.indicators = Object.assign([], me.indicators);
      //   }
      // };
    },
  },
};
</script>
<style>
@media (max-width: 1000px) {
  .container_indicator {
    margin-top: -50px !important;
  }
}
</style>
