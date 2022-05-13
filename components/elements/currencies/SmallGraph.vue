<template>
  <div>
    <v-sparkline
      v-if="value_g"
      :value="value_g"
      :color="color"
      :height="height"
      padding="10"
      stroke-linecap="round"
      :smooth="10"
    >
    </v-sparkline>
    <span v-else>{{ "no-data" }}</span>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Sparklines",
  props: {
    height: {
      type: Number,
      default: 100,
    },
    symbol: {
      type: String,
      default: "BTC",
    },
  },
  data() {
    return {
      value: [333, 446, 975, 510, 990, 610, 860],
      curent_dt: null,
      interv: null,
    };
  },
  computed: {
    ...mapGetters("data/graph", {
      g_data: "single",
    }),
    value_g() {
      this.curent_dt = this.g_data(this.symbol);
      let dt = this.curent_dt;
      if (dt && dt.length > 0) {
        let res = dt.map((el) => (el && el.length > 0 ? parseFloat(el[1]) : 0));
        return res;
      } else {
        return null;
      }
    },
    color() {
      if (this.value_g && this.value_g.length > 1) {
        if (this.value_g[this.value_g.length - 2] > this.value_g[this.value_g.length - 1]) {
          return "red";
        }
      }
      return "green";
    },
  },
  created() {
    this.interv = setInterval(() => {
      if (!this.curent_dt) {
        this.curent_dt = this.g_data(this.symbol);
      } else {
        clearInterval(this.interv);
      }
    }, 300);
  },
};
</script>

<style scoped>
</style>