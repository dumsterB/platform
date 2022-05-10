<template>
  <div>
    <TableProducts
      v-for="(item, i) in stocks"
      :key="i"
      :title="item.name"
      :currency="item.currency"
      :list="item.list"
    ></TableProducts>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import TableProducts from "~/components/data/TableProducts";

export default {
  components: {
    TableProducts,
  },
  data() {
    let stocks = JSON.parse(
      JSON.stringify(this.$store.state.config.data.exchanges)
    );
    return {
      stocks: stocks,
      subscrp: [],
    };
  },
  computed: {
    ...mapGetters("data/currency", {
      full_currency: "list",
    }),
    ...mapGetters("config/default", {
      get_val: "get_val",
    }),
    ...mapGetters("config/ws", {
      prices_current: "page_data",
    }),
    products() {
      let c_f = this.full_currency;
      return c_f.filter(
        (el) => el.currency_type && el.currency_type.key != "CRYPTO"
      );
    },
  },
  watch: {
    prices_current(v) {
      let me = this;
      let json_d = JSON.parse(JSON.stringify(v));
      me.stocks.forEach((st) => {
        if (json_d && json_d.method == `shares:all.${st.key}@kline_1d`) {
          let data = json_d.data ? json_d.data.data || [] : [];
          let list = [];
          data.forEach((dtm) => {
            let dt = dtm;
            if (Array.isArray(dtm)) {
              dt = dtm[0];
            }
            let curr = me.products.find((el) => el.symbol == dt.share);
            if (curr) {
              if (!dt.close) {
                let pdt = me.get_val(curr.symbol);
                if (pdt && pdt.close) {
                  dt.close = pdt.close;
                } else {
                  return;
                }
              }
              let p_d = {
                currency_type: curr.currency_type,
                name: curr.name,
                id: curr.id,
                symbol: curr.symbol,
                close: dt.close,
                open: dt.open,
                low: dt.low,
                high: dt.high,
                change: dt.close - dt.open,
                change_perc: ((dt.close - dt.open) * 100) / dt.open,
              };
              list.push(p_d);
            }
          });
          st.list = list;
        }
      });
      me.stocks = Object.assign([], me.stocks);
    },
  },
  methods: {
    ...mapActions("data/currency", {
      fetchCurrency: "fetchList",
    }),
    ...mapMutations("config/ws", {
      unsubscribe: "unsubscribe_page",
      subscribe: "set_page_subscribe",
    }),
  },
  created() {
    let me = this;
    me.subscrp = [];
    me.stocks.forEach((element, i) => {
      me.subscrp.push(`shares:all.${element.key}@kline_1d`);
    });
    this.subscribe(Object.assign([], me.subscrp));
  },
  destroyed() {
    this.unsubscribe();
  },
};
</script>
<style>
</style>
