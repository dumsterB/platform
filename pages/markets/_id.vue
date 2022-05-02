<template>
  <div>
    <Marketplace class="mt-4" :item="item" />
    <div v-if="isLoading" class="loader-market">
      <v-progress-circular
        :size="50"
        :width="5"
        color="primary"
        indeterminate
      ></v-progress-circular>
    </div>
    <v-row v-else class="mx-auto ml-1">
      <v-col class="" v-for="(curr, i) in currencies" :key="i">
        <Currency
          :currency="curr"
          :companies="companies"
          :tooltip="false"
          :id="`ttp-${curr.symbol}`"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Marketplace from "~/components/elements/Marketplace";
import Currency from "~/components/elements/Currency";

const model = "data/arbitrage_company";
import { mapGetters, mapActions, mapState, mapMutations } from "vuex";

export default {
  components: {
    Marketplace,
    Currency,
  },

  data() {
    return {
      currencies: [],
      isLoading: true,
    };
  },

  computed: {
    ...mapGetters(model, {
      companies: "list",
      companyById: "byId",
    }),
    ...mapGetters("data/currency", {
      currs: "list",
    }),
    ...mapGetters("config/ws", {
      prices_current: "page_data",
    }),
  },

  watch: {
    prices_current(v) {
      let me = this;
      let json_d = Object.assign({}, v);
      if (json_d && json_d.method == `${me.item.name}_all@ticker_10s`) {
        let data = json_d.data ? json_d.data.data || [] : [];
        let currencies = [];
        me.currs.forEach((el) => {
          let res = el;
          let fnd = data.find((e) => e && e.base == el.symbol);
          if (fnd && fnd.price) {
            res.price = fnd.price;
            res.change = fnd.change;
            res.change_p = (
              (parseFloat(fnd.change) * 100) /
              parseFloat(fnd.price)
            ).toFixed(4);
            currencies.push(res);
          }
        });
        me.currencies = currencies;
        me.isLoading = false;
      }
    },
  },

  methods: {
    ...mapActions(model, {
      fetchCompanyById: "fetchSingle",
      fetchAC: "fetchList",
    }),
    ...mapMutations("config/ws", {
      unsubscribe: "unsubscribe_page",
      subscribe: "set_page_subscribe",
    }),
  },
  created() {
    this.item = this.companyById(parseInt(this.$route.params.id));
    if (this.item) {
      this.subscribe([`${this.item.name}_all@ticker_10s`]);
    }
  },
  destroyed() {
    if (this.item) {
      this.unsubscribe();
    }
  },
};
</script>
<style>
.loader-market {
  padding-top: 100px;
  text-align: center;
}
</style>
