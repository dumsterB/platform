<template>
  <v-row>
    <v-col :cols="2">
      <p class="ma-0 pa-0 mt-3">{{ indicators[0].title }}</p>
      <p class="ma-0 pa-0 mt-1" :style="diffColor(change)">
        {{ price }}
      </p>
    </v-col>
    <v-col :cols="2">
      <p class="ma-0 pa-0 mt-3">{{ indicators[1].title }}</p>
      <p class="ma-0 pa-0 mt-1" :style="diffColor(change)">
        {{ change ? change.toFixed(4) : "" }}
      </p>
    </v-col>
    <v-col :cols="2">
      <p class="ma-0 pa-0 mt-3">{{ indicators[2].title }}</p>
      <p class="ma-0 pa-0 mt-1">
        {{ high }}
      </p>
    </v-col>
    <v-col :cols="2">
      <p class="ma-0 pa-0 mt-3">{{ indicators[3].title }}</p>
      <p class="ma-0 pa-0 mt-1">
        {{ low }}
      </p>
    </v-col>
  </v-row>
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
        return "color: 'red';";
      } else {
        return "color: 'green';";
      }
    },
  },
  watch: {
    currency() {
      let me = this;
      console.log("this.currency", this.currency);
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
