<template>
  <div>
    <v-card class="px-4 pb-0">
      <div class="mb-6">
        <v-list-item-group>
          <v-list-item
            tag="button"
            block
            class="orderBtn primary--text pt-1 mb-2 font-weight-bold"
            :style="customStyle"
            exact-active-class="orderBtn"
            active-class="orderBtn"
            elevation="0"
            >{{ $t("orderes_book") }}</v-list-item
          >
        </v-list-item-group>
        <v-divider></v-divider>
        <v-row style="height: 38px"
          ><v-col
            ><span class="gray--text" style="font-size: 12px"
              >{{ $t("price") }} (USD)</span
            ></v-col
          ><v-col class="gray--text" style="font-size: 12px"
            >{{ $t("quantity_title") }} ({{ currency }})</v-col
          ></v-row
        ><v-row
          v-for="(dt, i) in rise_data"
          :key="i"
          style="height: 24px; font-size: 12px; margin-bottom: -10px"
          :style="`background: linear-gradient(to right, transparent 0%, transparent ${
            100 - dt.perc
          }%, rgb(1,186,198,0.3) ${100 - dt.perc}%, rgb(1,186,198,0.3) 100%)`"
        >
          <v-col :cols="6" class="pt-1"
            ><span style="font-weight: 600">{{ dt.price }}</span></v-col
          >
          <v-col :cols="6" class="pt-1"
            ><span>{{ dt.total }}</span></v-col
          >
        </v-row>
        <v-row>
          <v-col :class="`${diffColor(change)}--text pa-1`"
            ><v-icon class="pb-2" :color="diffColor(change)">{{
              change > 0 ? "mdi-chevron-up" : "mdi-chevron-down"
            }}</v-icon>
            <span style="font-weight: 600; font-size: 28px">{{
              change_val
            }}</span
            ><span style="font-weight: 400; font-size: 12px">
              ≈ {{ change }} USD</span
            >
          </v-col>
        </v-row>
        <v-row
          v-for="(dt, i) in fall_data"
          :key="number_d + i"
          style="height: 24px; font-size: 14px; margin-bottom: -10px"
          :style="`background: linear-gradient(to right, transparent 0%, transparent ${
            100 - dt.perc
          }%, rgb(211,34,98,0.3) ${100 - dt.perc}%, rgb(211,34,98,0.3) 100%)`"
        >
          <v-col :cols="6" class="pt-1"
            ><span style="font-weight: 600">{{ dt.price }}</span></v-col
          >
          <v-col :cols="6" class="pt-1"
            ><span>{{ dt.total }}</span></v-col
          >
        </v-row>
      </div>
    </v-card>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import config from "~/config/config.json";

export default {
  props: {
    currency: {
      type: String,
      default: "BTC",
    },
    change: {
      type: Number,
      default: 0.0001,
    },
    price: {
      type: Number,
      default: 10000,
    },
  },
  components: {},
  data() {
    return {
      primary: config.colors.text.primary,
      number_d: 11,
      rise_data: [],
      fall_data: [],
      interv: null,
    };
  },
  computed: {
    change_val() {
      return Math.round((this.change / this.price) * 100000) / 100000;
    },
    round_val() {
      let r = this.price;
      let res = 1;
      while (r > 1) {
        r = r / 10;
        res = res * 10;
      }
      return res;
    },
    customStyle() {
      return {
        "--primary": this.primary,
      };
    },
  },
  methods: {
    diffColor(el) {
      if (el < 0) {
        return "red";
      } else {
        return "primary";
      }
    },
    fill_data() {
      let dt = [];
      for (let i = 0; i < this.number_d; i++) {
        dt.push({
          price:
            Math.round(
              (this.price + (this.price * (0.5 - Math.random())) / 500) *
                (1000000 / this.round_val)
            ) /
            (1000000 / this.round_val),
          total:
            Math.round(
              ((Math.random() * (2 - Math.random()) * 5000) / this.price) *
                this.round_val
            ) / this.round_val,
        });
      }
      dt.sort(function (a, b) {
        if (a.total > b.total) {
          return 1;
        }
        if (a.total < b.total) {
          return -1;
        }
        return 0;
      });
      let lst = dt[dt.length - 1].total;
      dt.forEach((el) => {
        el.perc = parseInt((100 * el.total) / lst);
      });
      return dt;
    },
  },
  watch: {
    price() {
      //   this.rise_data = this.fill_data();
      //   this.fall_data = this.fill_data();
    },
  },
  created() {
    this.interv = setInterval(() => {
      this.rise_data = this.fill_data();
      this.fall_data = this.fill_data();
    }, 1000);
  },
};
</script>
<style lang="scss" scoped>
.orderBtn {
  position: relative;
  background: transparent !important;
}
.orderBtn:after {
  position: absolute;
  content: "";
  width: 100%;
  min-height: 6px !important;
  top: 0;
  left: 0;
  background: var(--primary) !important;
  border-radius: 0px 0px 4px 4px;
}
</style>
