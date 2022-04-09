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
import { mapGetters, mapActions } from "vuex";
import MarketItem from "~/components/elements/MarketItem";
const model = "data/arbitrage_company";

export default {
  components: {
    MarketItem,
  },
  data() {
    return {
      send_str: "",
      prices: {},
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
  },
  created() {
    let me = this;
    let socket = global.socket;
    let send_str = "";
    for (let prop in me.fav_currs) {
      me.fav_currs[prop].forEach((element, i) => {
        send_str += `"${prop}_${element}-USD@ticker_5s"`;
        send_str += ", ";
      });
    }

    if (send_str && send_str.length > 10) {
      me.send_str = send_str.slice(0, -2);
    }
    socket.send(`{
      "method": "subscribe",
      "data": [${me.send_str}]
    }`);

    socket.onmessage = function (event) {
      if (event.data) {
        let json_d = JSON.parse(event.data);
        for (let prop in me.fav_currs) {
          me.fav_currs[prop].forEach((curr) => {
            if (json_d && json_d.method == `${prop}_${curr}-USD@ticker_5s`) {
              let data = json_d.data ? json_d.data.data || [] : [];
              if (!me.prices[prop]) me.prices[prop] = {};
              me.prices[prop][curr] = data[0] ? data[0].price : 1;
            }
          });
        }
      }
    };
    setTimeout(() => {
      me.prices = Object.assign({}, me.prices);
    }, 800);
    me.interv = setInterval(() => {
      me.prices = Object.assign({}, me.prices);
    }, 1500);
  },
  destroyed() {
    let socket = global.socket;
    socket.send(`{
      "method": "unsubscribe",
      "data": [${this.send_str}]
    }`);
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
