<template>
  <v-row>
    <v-col
      class="mt-3"
      :cols="12"
      :md="2"
      :lg="2"
      :sm="12"
      :xs="12"
      v-for="(val, i) in list"
      :key="i"
    >
      <v-btn
        x-large
        outlined
        :width="150"
        :class="val.clicked ? 'btn-clicked' : ''"
        @click="changeClicked(val)"
      >
        <div>
          <p class="ma-0 pa-3 pb-0 mt-0">{{ val.name }}</p>
          <p class="price ma-0 pa-3 pt-0 mt-1">${{ val.price }}</p>
        </div>
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
const model = "data/arbitrage_company";

export default {
  props: {
    currency: {
      type: String,
      default: "BTC",
    },
    prices: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      list: [],
      interv: null,
      first: false,
    };
  },
  computed: {
    ...mapGetters(model, {
      ac: "list",
    }),
  },
  methods: {
    resetList(prices) {
      let list = this.ac.map((el, i) => {
        let fnd = prices.find((e) => e && e.company == el.name);
        let pr = 0;
        if (fnd && fnd.price) pr = fnd.price;
        el.price = pr;
        return el;
      });
      if (!this.first) {
        this.first = true;
        list.forEach((el, i) => {
          if (i == 0) {
            el.clicked = true;
          } else {
            el.clicked = false;
          }
        });
      }
      if (list.length > 5) {
        this.list = list.slice(0, 5);
      } else {
        this.list = list;
      }
    },
    changeClicked(val) {
      let list = this.list.map((el) => {
        if (el.id == val.id) {
          el.clicked = true;
        } else {
          el.clicked = false;
        }
        return el;
      });
      this.list = list;
      this.$emit("clicked", val.name);
    },
  },
  watch: {
    prices() {
      this.resetList(this.prices);
    },
  },
  async created() {},
};
</script>
<style lang="scss" scoped>
.price {
  font-size: 13px !important;
}
.btn-clicked {
  // toolbar background
  background-color: #3d3d3d;
}
html[theme="light"] {
  .btn-clicked {
    // toolbar background
    background-color: #ebebeb;
  }
}
</style>
