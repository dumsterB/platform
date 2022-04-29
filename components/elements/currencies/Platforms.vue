<template>
  <v-row>
    <v-col
      class="mt-0"
      :cols="12"
      :md="2"
      :lg="2"
      :sm="12"
      :xs="12"
      v-for="(val, i) in list"
      :key="i"
    >
      <v-btn
        large
        :width="100"
        outlined
        :class="val.clicked ? 'primary' : ''"
        style="border-radius: 20px"
        @click="changeClicked(val)"
      >
        <div>
          <v-img
            contain
            tag="img"
            height="20px"
            width="80px"
            :src="val.logo"
            :alt="val.name"
            class=""
          ></v-img>
          <p class="price ma-0">{{ val.price ? '$' + val.price : 'no data' }}</p>
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
  font-size: 12px !important;
}
.btn-clicked {
  background-color: #3d3d3d;
}
html[theme="light"] {
  .btn-clicked {
    background-color: #ebebeb;
  }
}
</style>
