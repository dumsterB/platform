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
import { mapActions, mapGetters } from "vuex";
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
      subscrp: "",
    };
  },
  computed: {
    ...mapGetters("data/currency", {
      full_currency: "list",
    }),
    products() {
      let c_f = this.full_currency;
      return c_f.filter(
        (el) => el.currency_type && el.currency_type.key != "CRYPTO"
      );
    },
  },
  methods: {
    ...mapActions("data/currency", {
      fetchCurrency: "fetchList",
    }),
  },
  created() {
    let me = this;
    let socket = global.socket;
    me.subscrp = "";
    me.stocks.forEach((element, i) => {
      me.subscrp += `"shares_all.${element.key}@kline_1d"`;
      if (i != me.stocks.length - 1) {
        me.subscrp += `, `;
      }
    });
    socket.send(`{
      "method": "subscribe",
      "data": [${me.subscrp}]
    }`);
    socket.onmessage = function (event) {
      if (event.data) {
        let json_d = JSON.parse(event.data);
        me.stocks.forEach((st) => {
          if (json_d && json_d.method == `shares_all.${st.key}@kline_1d`) {
            let data = json_d.data ? json_d.data.data || [] : [];
            let list = [];
            data.forEach((dtm) => {
              let dt = dtm;
              if (Array.isArray(dtm)) {
                dt = dtm[0];
              }
              let curr = me.products.find((el) => el.symbol == dt.share);
              if (curr) {
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
                  change_perc: (dt.close - dt.open) * 100 / dt.open,
                };
                list.push(p_d);
              }
            });
            st.list = list;
          }
        });
        me.stocks = Object.assign([], me.stocks);
      }
    };
  },
  destroyed() {
    let socket = global.socket;
    socket.send(`{
      "method": "unsubscribe",
      "data": [${this.subscrp}]
    }`);
  },
};
</script>
<style>
</style>
