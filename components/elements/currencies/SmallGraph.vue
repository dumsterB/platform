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
    };
  },
  computed: {
    ...mapGetters("data/graph", {
      g_data: "single",
    }),
    value_g() {
      let dt = this.g_data(this.symbol);
      if (dt && dt.length > 0) {
        let res = dt.map((el) => (el && el.length > 0 ? parseFloat(el[1]) : 0));
        return res;
      } else {
        return null;
      }
    },
    color() {
      if (this.value_g && this.value_g.length > 0) {
        if (this.value_g[0] > this.value_g[this.value_g.length - 1]) {
          return "red"
        }
      }
      return "primary"
    }
  },
};
</script>

<style scoped>
</style>