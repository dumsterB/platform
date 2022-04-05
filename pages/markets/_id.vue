<template>
  <div>
    <Marketplace class="mt-4" :item="item" />
    <v-row class="mx-auto ml-1">
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
import { mapGetters, mapActions, mapState } from "vuex";

export default {
  components: {
    Marketplace,
    Currency,
  },

  data() {
    return {
      currencies: [],
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
  },

  methods: {
    ...mapActions(model, {
      fetchCompanyById: "fetchSingle",
      fetchAC: "fetchList",
    }),
  },
  created() {
    this.item = this.companyById(parseInt(this.$route.params.id));
    if (this.item) {
      let me = this;
      let socket = global.socket;
      socket.send(`{
        "method": "subscribe",
        "data": ["${me.item.name}_all@ticker_10s"]
      }`);
      socket.onmessage = function (event) {
        if (event.data) {
          let json_d = JSON.parse(event.data);
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
          }
          // console.log('me.currs', me.currs)
        }
      };
    }
  },
  destroyed() {
    let socket = global.socket;
    if (this.item) {
      socket.send(`{
        "method": "unsubscribe",
        "data": ["${this.item.name}_all@ticker_10s"]
      }`);
    }
  },
};
</script>
