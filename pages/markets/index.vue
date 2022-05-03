<template>
  <v-row>
    <v-col>
      <v-row class="ml-4 mr-4">
        <v-col
          class="d-flex justify-center mt-4"
          :xl="3"
          :lg="4"
          :md="6"
          v-for="(company, i) in companies"
          :key="i"
        >
          <MarketItem
            :item="company"
            :prices="prices[company.name]"
            :currencies="fav_currencies[i]"
          />
        </v-col>
      </v-row>
      <v-col v-if="!companies.length" class="d-flex justify-center mt-4">
        <p>
          {{ $t("no_market_place") }}
        </p>
      </v-col>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import MarketItem from "~/components/elements/MarketItem";
const model = "data/arbitrage_company";

export default {
  components: {
    MarketItem,
  },
  data() {
    let cp = JSON.parse(JSON.stringify(this.$store.getters["config/default/arb_data"]));
    return {
      prices: cp,
      interv: null,
    };
  },
  computed: {
    ...mapGetters(model, {
      companies: "list",
      fav_currs: "currencies",
    }),
    ...mapGetters("data/currency", {
      currency: "list",
    }),
    ...mapGetters("config/ws", {
      prices_current: "page_data",
    }),
    fav_currencies() {
      let res = [];
      this.companies.forEach((comp, i) => {
        let f_c = this.fav_currs[comp.name];
        if (f_c) {
          let currs = this.currency.filter((el) => {
            let fnd = f_c.find((e) => e == el.symbol);
            if (fnd) {
              return true;
            }
            return false;
          });
          res.push(currs);
        } else {
          res.push(null);
        }
      });
      return res;
    },
  },
  methods: {
    ...mapActions(model, {
      fetchAC: "fetchList",
    }),
    ...mapMutations("config/ws", {
      unsubscribe: "unsubscribe_page",
      subscribe: "set_page_subscribe",
    }),
  },
  created() {
    let me = this;
    let send_arr = [];
    for (let prop in me.fav_currs) {
      me.fav_currs[prop].forEach((element, i) => {
        send_arr.push(`${prop}:${element}-USD@ticker_5s`);
      });
    }
    me.subscribe(Object.assign([], send_arr));
    setTimeout(() => {
      me.prices = Object.assign({}, me.prices);
    }, 800);
    me.interv = setInterval(() => {
      me.prices = Object.assign({}, me.prices);
    }, 1500);
  },
  watch: {
    prices_current(v) {
      let me = this;
      let json_d = Object.assign({}, v);
      for (let prop in me.fav_currs) {
        me.fav_currs[prop].forEach((curr) => {
          if (json_d && json_d.method == `${prop}:${curr}-USD@ticker_5s`) {
            let data = json_d.data ? json_d.data.data || [] : [];
            if (!me.prices[prop]) me.prices[prop] = {};
            me.prices[prop][curr] = data[0] ? data[0].price : 1;
          }
        });
      }
    },
  },
  destroyed() {
    this.unsubscribe();
    if (this.interv) {
      clearInterval(this.interv);
    }
  },
};
</script>

<style lang="scss" scoped>
.bgColor {
  background-color: transparent !important;
  background: transparent !important;
}
</style>
