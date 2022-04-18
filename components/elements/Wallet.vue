<template>
  <div class="ma-4">
    <div class="d-flex mdc-form-field--space-between">
      <p class="text-h6 mx-4">{{ $t("my_wallet") }}</p>
      <a class="mx-4" @click="$router.push('/wallet')">{{ $t("show_all") }}</a>
    </div>
    <v-card class="pa-3" elevation="4">
      <div class="justify-center">
        <div class="text-center justify-center d-flex pa-4">
          <div>
            <div>{{ $t("total") }}</div>
            <div id="chart ">
              <apexchart
                class="apexchart"
                type="donut"
                :options="chartOptions"
                :series="series"
              ></apexchart>
            </div>
            <strong class="text-h4"
              >${{ total_sum ? total_sum.toFixed(4) : "" }}</strong
            >
            <div>≈ {{ total_sum_btc ? total_sum_btc.toFixed(4) : "" }} BTC</div>
          </div>
        </div>
        <div class="mt-10">
          <v-card class="mx-auto" elevation="0" tile>
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
                      coin.balance ? coin.balance.toFixed(4) : ""
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
                  <span class="ml-2">
                    {{ getLengthArr + " " + $t("others") }}</span
                  ></v-list-item-title
                >
                <v-spacer></v-spacer>
                <v-list-item-content class="flexNone">
                  <v-list-item-title>
                    ${{
                      other_sum ? other_sum.toFixed(4) : ""
                    }}</v-list-item-title
                  >
                </v-list-item-content>
              </v-list-item>
              <v-divider></v-divider>
              <a v-if="!more" class="ma-3" @click="view_more">{{
                $t("view_more")
              }}</a>
            </div>
            <a v-if="more" class="ma-3" @click="view_back">{{
              $t("go_back")
            }}</a>
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
        labels: [],
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
          currency: el.currency.symbol,
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
            this.total_sum += element.balance;
          } else {
            this.total_sum += element.balance;
          }
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
        this.apexArrSymbol = this.filteredArr.map((e) => `${e.currency} $`);
        this.apexArrBalance = this.filteredArr.map((e) => e.balance);
        if (this.getLengthArr > 0) {
          this.apexArrBalance.push(this.other_sum);
          this.apexArrSymbol.push(this.$t("others"));
        }
        this.chartOptions.labels = this.apexArrSymbol;
        this.series = this.apexArrBalance;
        this.chartOptions = Object.assign({}, this.chartOptions);
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
    }, 2000);
    this.fetchWallet();
  },
};
</script>

<style>
.apexcharts-legend.apx-legend-position-right {
  display: none;
}
</style>
