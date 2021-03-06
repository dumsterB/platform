<template>
  <div class="mt-4">
    <div class="d-flex mdc-form-field--space-between">
      <p class="text-h6 mr-4 font-weight-bold">{{ $t("my_wallet") }}</p>
      <a class="mx-4 mt-1" @click="$router.push('/wallet')">{{
        $t("show_all")
      }}</a>
    </div>
    <v-card class="pa-3" elevation="4">
      <div class="justify-center">
        <div class="text-center justify-center d-flex pa-4">
          <div>
            <div>{{ $t("total")}}</div>
            <div id="chart ">
              <apexchart
                class="apexchart ml-4"
                type="donut"
                :options="chartOptions"
                :series="series"
              ></apexchart>
            </div>
            <strong class="text-h4"
              >${{ new Intl.NumberFormat().format(total_sum) }}</strong
            >
            <div>
              ≈
              {{ new Intl.NumberFormat().format(total_sum_btc) }}
              BTC
            </div>
          </div>
        </div>
        <div class="mt-10">
          <v-card class="mx-auto borderNone" elevation="0" tile>
            <div v-for="(coin, i) of filteredArr" :key="i">
              <v-list-item class="pa-1">
                <v-list-item-content>
                  <v-list-item-title>
                    <v-badge
                      class="ml-1 mb-1"
                      :color="chartOptions.colors[i]"
                      dot
                    ></v-badge>
                    <span
                      class="ml-2"
                      style="cursor: pointer"
                      @click="wall_click(coin)"
                      >{{ coin.currency }}</span
                    ></v-list-item-title
                  >
                </v-list-item-content>
                <v-spacer></v-spacer>
                <v-list-item-content class="flexNone">
                  <v-list-item-title
                    >${{
                      coin.balance
                        ? new Intl.NumberFormat().format(coin.balance)
                        : "0"
                    }}</v-list-item-title
                  >
                </v-list-item-content>
              </v-list-item>
              <v-divider></v-divider>
            </div>
            <div v-if="getLengthArr > 0">
              <v-list-item class="pa-1">
                <v-list-item-title>
                  <v-badge
                    class="ml-1 mb-1"
                    dot
                    :color="chartOptions.colors[this.limit]"
                  ></v-badge>
                  <span
                    class="ml-2 primary--text"
                    style="cursor: pointer"
                    @click="
                      $router.push({
                        path: '/wallet',
                      })
                    "
                  >
                    {{ getLengthArr + " " + $t("others") }}</span
                  ></v-list-item-title
                >
                <v-spacer></v-spacer>
                <v-list-item-content class="flexNone">
                  <v-list-item-title>
                    ${{
                      other_sum ? new Intl.NumberFormat().format(other_sum) : ""
                    }}</v-list-item-title
                  >
                  <!-- <a
                    v-if="!more"
                    class="mt-3 mb-3 ml-auto mr--auto"
                    style="text-align: center"
                    @click="
                      $router.push({
                        path: '/wallet',
                      })
                    "
                    >{{ $t("view_more") }}</a
                  > -->
                </v-list-item-content>
              </v-list-item>
              <v-divider></v-divider>
            </div>
            <a
              v-if="more"
              class="mt-3 mb-3 ml-auto mr--auto"
              style="text-align: center"
              @click="view_back"
              >{{ $t("go_back") }}</a
            >
          </v-card>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import apexchart from "vue-apexcharts";

const wallet = "data/wallet";
const currencies = "data/currency";
export default {
  components: {
    apexchart,
  },
  name: "Wallet",
  props: {
    prices: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      apexArrBalance: [],
      apexArrSymbol: [],
      def_coins: ["USD", "BTC", "ETH", "DOT", "XRP"],
      someArray: [],
      getLengthArr: 0,
      other_sum: 0,
      total_sum: 0,
      total_sum_btc: 0,
      series: [1],
      filteredArr: [],
      more: false,
      counter: 0,
      wait_render: true,
      limit: 5,
      chartOptions: {
        colors: [
          "#53d923",
          "#d9a823",
          "#0fb7d9",
          "#7762a8",
          "#b52d9c",
          "#04151a",
          "#767ed1",
          "#b81452",
          "#9e225e",
          "#c757ab",
          "#26d040",
          "#5d9acb",
          "#bd6728",
          "#1984b7",
          "#5fc75a",
          "#f08a89",
          "#b9535b",
          "#47b987",
          "#7ce5f1",
          "#06758b",
        ],
        labels: ["You do not have any wallet with a non-zero balance"],
        chart: {
          type: "donut",
        },
        stroke: {
          width: 0,
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
                height: 300,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
      },
    };
  },
  computed: {
    ...mapGetters("data/wallet", {
      wallet: "list",
    }),
    ...mapGetters("data/currency", {
      currencies: "list",
    }),
    ...mapGetters("config/default", {
      get_val: "get_val",
    }),
  },
  methods: {
    ...mapActions(wallet, {
      fetchWallet: "fetchList",
    }),
    ...mapActions(currencies, {
      fetchCurrencies: "fetchList",
    }),
    wall_click(coin) {
      this.$router.push({
        path: `/currency?id=${coin.currency_id}`,
      });
    },
    view_more() {
      this.limit = 20;
      this.more = true;
      this.counter = 1;
      this.filteredArrInit();
    },
    view_back() {
      this.limit = 5;
      this.more = false;
      this.counter = 1;
      this.filteredArrInit();
    },
    filteredArrInit() {
      let data = this.wallet.map((el) => {
        return {
          balance: el.balance,
          currency: el.currency ? el.currency.symbol : "NO DATA",
          currency_id: el.currency_id,
        };
      });
      this.total_sum = 0;
      if (this.prices && this.prices.length > 0) {
        data.forEach((element) => {
          let fnd = this.prices.find((el) => el && el.base == element.currency);
          if (fnd && fnd.price) {
            element.balance =
              parseFloat(element.balance) * parseFloat(fnd.price);
          }
          this.total_sum += element.balance;
        });
        let fnd_btc = this.prices.find((el) => el && el.base == "BTC");
        if (fnd_btc) {
          this.total_sum_btc = this.total_sum / parseFloat(fnd_btc.price);
        }
      }

      data.sort((a, b) => {
        return b.balance - a.balance;
      });
      this.getLengthArr = data.length - this.limit;
      if (data.length > this.limit) {
        let other_sum = 0;
        for (let i = this.limit; i < data.length; i++) {
          other_sum += data[i].balance;
        }
        this.other_sum = other_sum;
        this.filteredArr = data.slice(0, this.limit);
      } else {
        this.filteredArr = data;
      }

      if (this.counter < 2) {
        this.counter += 1;
        this.apexArrSymbol = this.filteredArr.map(
          (e) => `${new Intl.NumberFormat().format(e.currency)} $`
        );
        this.apexArrBalance = this.filteredArr.map((e) => e.balance);
        if (this.getLengthArr > 0) {
          this.apexArrBalance.push(this.other_sum);
          this.apexArrSymbol.push(this.$t("others"));
        }
        if (this.apexArrBalance && this.apexArrBalance.length > 0 && this.total_sum > 0) {
          this.chartOptions.labels = this.apexArrSymbol;
          this.series = this.apexArrBalance;
          this.chartOptions = Object.assign({}, this.chartOptions);
        }
      }
      if (this.filteredArr.length < this.limit) {
        let def_currs_all = this.def_coins.map((el) => {
          let fnd = this.currencies.find((e) => e.symbol == el);
          return {
            balance: 0,
            currency: el,
            currency_id: fnd.id,
          };
        });
        let def_currs = def_currs_all.filter((el) => {
          let fnd1 = this.filteredArr.find((e) => e.currency == el.currency);
          return !fnd1;
        });
        let cc = 0;
        while (this.filteredArr.length != this.limit) {
          this.filteredArr.push(def_currs[cc]);
          cc += 1;
        }
      }
    },
  },

  watch: {
    prices() {
      if (!this.wait_render) {
        this.filteredArrInit();
      }
    },
    wait_render() {
      if (!this.wait_render) {
        this.filteredArrInit();
      }
    },
  },

  created() {
    setTimeout(() => {
      this.wait_render = false;
    }, 1000);
    this.fetchWallet();
  },
};
</script>

<style>
.apexcharts-legend.apx-legend-position-right {
  display: none;
}
</style>
