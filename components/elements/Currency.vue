<template>
  <div>
    <v-tooltip v-if="tooltip" bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-hover v-slot="{ hover }" open-delay="223" close-delay="223">
          <v-card
            class="currecyCard mainBorderRadius"
            :elevation="hover ? 18 : 8"
            v-bind="attrs"
            v-on="on"
            max-width="350"
            :style="customStyles"
            :class="backgroundDiffColor(currency.change_p)"
            @click="$router.push(`/currency?id=${currency.id}`)"
          >
            <v-list-item three-line class="pa-2 px-4 mainBorderRadius d-flex">
              <v-list-item-content class="pa-1 mainBorderRadius">
                <div class="d-flex">
                  <v-img :src="currency.logo" :max-width="32"></v-img>
                  <span class="mt-1 ml-1 curr_name">{{ currency.symbol }}</span>
                </div>
                <span class="price-text" style="margin-bottom: -4px"
                  >${{ new Intl.NumberFormat().format(currency.price) }}</span
                >
              </v-list-item-content>
              <v-list-item-content class="coinList pa-1 pr-0 flexNone">
                <div class="star-btn">
                  <v-btn icon>
                    <v-icon
                      @click.prevent.stop="handlerSelection"
                      size="30"
                      v-if="star_selection"
                      color="primary"
                      >mdi-star</v-icon
                    >
                    <v-icon
                      @click.prevent.stop="handlerSelection"
                      size="25"
                      v-if="!star_selection"
                      class="primary--text"
                      >mdi-star-outline</v-icon
                    >
                  </v-btn>
                </div>
                <div class="text-right px-1">
                  <span
                    :style="customStyles"
                    :class="diffColor(currency.change_p)"
                    >{{ currency.change_p }}%</span
                  >
                </div>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <div>
                  <SmallGraph :symbol="currency.symbol"></SmallGraph>
                </div>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-hover>
      </template>
      <div class="ac-toolltip">
        <div v-if="companies && companies.length > 0">
          <span v-for="(item, i) in companies" :key="i">
            <span>
              {{ item.name }}
            </span>
            <span style="float: right"> ${{ item.price }} </span>
            <br />
          </span>
        </div>
        <v-progress-circular
          v-else
          :size="25"
          :width="3"
          color="primary"
          indeterminate
          style="left: 64px"
        ></v-progress-circular>
      </div>
    </v-tooltip>
    <v-card
      v-else
      max-width="350"
      class="currecyCard mainBorderRadius light-card"
      :elevation="hover ? 18 : 8"
      v-bind="attrs"
      v-on="on"
      :style="customStyles"
      :class="backgroundDiffColor(currency.change_p)"
      @click="$router.push(`/currency?id=${currency.id}`)"
    >
      <v-list-item three-line class="pa-2 mainBorderRadius d-flex">
        <v-list-item-content class="pa-1 mainBorderRadius">
          <div class="d-flex">
            <v-img :src="currency.logo" :max-width="32"></v-img>
            <span class="mt-1 ml-1 curr_name">{{ currency.symbol }}</span>
          </div>
          <span class="price-text-sm" style="margin-bottom: -4px"
            >${{ new Intl.NumberFormat().format(currency.price) }}</span
          >
        </v-list-item-content>
        <v-list-item-content class="coinList pa-1 flexNone">
          <div class="star-btn pt-1">
            <v-btn
              small
              class="elevation-0 mainBorderRadius"
              color="rgba(255, 255, 255, 0.15)"
            >
              24H
            </v-btn>
          </div>
          <span :style="customStyles" :class="diffColor(currency.change_p)"
            >{{ currency.change_p }}%</span
          >
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          <div style="min-width: 200px">
            <SmallGraph :symbol="currency.symbol"></SmallGraph>
          </div>
        </v-list-item-content>
      </v-list-item>
    </v-card>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import config from "~/config/config.json";
import SmallGraph from "~/components/elements/currencies/SmallGraph";
export default {
  components: {
    SmallGraph,
  },
  props: {
    currency: {
      type: Object,
      default: () => {
        return {};
      },
    },
    companies: {
      type: Array,
      default: () => {
        return [];
      },
    },
    tooltip: false,
  },
  data() {
    return {
      green: config.themes.dark.green,
      red: config.themes.dark.red,
      border: config.colors.border,
      interv: null,
      star_selection: false,
    };
  },
  watch: {},
  computed: {
    ...mapGetters("data/currency", {
      currencies: "list",
    }),
    ...mapGetters("data/arbitrage_company", {
      arbitrage_company: "list",
    }),
    customStyles() {
      return {
        "--green": this.green,
        "--red": this.red,
        "--border": this.border,
      };
    },
  },
  methods: {
    diffColor(diff) {
      if (diff < 0) {
        return "back-failure";
      } else {
        return "back-success";
      }
    },
    backgroundDiffColor(diff) {
      if (diff < 0) {
        return "background-failure";
      } else {
        return "background-success";
      }
    },
    handlerSelection(currency) {
      // console.log(currency.name);
      this.star_selection = !this.star_selection;
    },
  },
  mounted() {},
};
</script>
<style lang="scss" scoped>
.ac-toolltip {
  width: 160px;
}
.coinList {
  width: 80px;
}
.coinList span {
  padding-top: 10px;
}
.curr_name {
  color: #979797;
  padding-left: 10px;
  padding-top: 5px;
}
.coinList .chip {
  // 24H background
  background-color: #3d3d3d;
  padding: 1px;
  text-align: center;
  font-size: 13px;
  border-radius: 10px;
  width: 5px !important;
}
.currecyCard {
  cursor: pointer;
  padding: 0px 2px 0px 2px;
}
.price-text {
  font-size: 20px;
  font-weight: 700;
}
.price-text-sm {
  font-size: 16px;
  font-weight: 600;
}
.star_btn:hover {
  background: none;
}
html[theme="light"] {
  .chip {
    // 24H background
    background-color: #ebebeb;
    padding: 1px;
    text-align: center;
    font-size: 13px;
    border-radius: 10px;
    width: 5px !important;
  }
  .background-failure {
    background: var(--red);
    background: -webkit-linear-gradient(36deg, var(--red), #ffffff);
    background: linear-gradient(36deg, var(--red), #ffffff);
    filter: blur(0.3px);
  }
  .background-success {
    background: var(--green);
    background: -webkit-linear-gradient(36deg, var(--green), #ffffff);
    background: linear-gradient(36deg, var(--green), #ffffff);
    filter: blur(0.3px);
  }
}
.background-failure {
  background: var(--red);
  background: -webkit-linear-gradient(36deg, var(--red), #000000);
  background: linear-gradient(36deg, var(--red), #000000);
  filter: blur(0.3px);
}
.background-success {
  background: var(--green);
  background: -webkit-linear-gradient(36deg, var(--green), #000000);
  background: linear-gradient(36deg, var(--green), #000000);

  filter: blur(0.3px);
}
.star-btn {
  text-align: right;
  margin: 0 -2px 0 0;
  width: 40px;
}

.back-failure {
  font-weight: 600;
  color: var(--red);
}

.back-success {
  color: var(--green);
  font-weight: 600;
}
@media (max-width: 1000px) {
}
</style>
