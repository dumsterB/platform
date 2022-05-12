<template>
  <div>
    <v-sparkline
      :value="value"
      color="#BA68C8"
      :height="height"
      padding="10"
      stroke-linecap="round"
      :smooth="10"
    >
    </v-sparkline>
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
      default: 'BTC',
    }
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
      let res = dt.map(el => el && el.length > 0 ? el[1] : 0);
      return res;
    }
  },
};
</script>

<style scoped>
</style>