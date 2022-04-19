<template>
  <div>
    <v-tooltip v-if="tooltip" bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-hover v-slot="{ hover }" open-delay="223" close-delay="223">
          <v-card
            class="currecyCard rounded-lg"
            :elevation="hover ? 18 : 8"
            v-bind="attrs"
            v-on="on"
            :style="customStyles"
            :class="backgroundDiffColor(currency.change_p)"
            @click="$router.push(`/currency?id=${currency.id}`)"
          >
            <v-list-item
              three-line
              class="pa-2 rounded-lg d-flex"
            >
              <v-list-item-content class="pa-1 rounded-lg">
                <div class="d-flex">
                  <v-img :src="currency.logo" :max-width="32"></v-img>
                  <span class="mt-1 ml-1 curr_name">{{ currency.symbol }}</span>
                </div>
                <span class="price-text" style="margin-bottom: -4px">${{ currency.price }}</span>
              </v-list-item-content>
              <v-list-item-content class="coinList pa-1 flexNone">
                <div class="star-btn">
                  <v-btn icon>
                    <v-icon
                      @click.prevent.stop="handlerSelection"
                      size="30"
                      v-if="star_selection"
                      color="yellow"
                      >mdi-star</v-icon
                    >
                    <v-icon
                      @click.prevent.stop="handlerSelection"
                      size="25"
                      v-if="!star_selection"
                      class="yellow--text"
                      >mdi-star-outline</v-icon
                    >
                  </v-btn>
                </div>
                <span
                  :style="customStyles"
                  :class="diffColor(currency.change_p)"
                  >{{ currency.change_p }}%</span
                >
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
            <v-list-item-content>
            <div>
              <sparklines></sparklines>
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
    <v-card v-else class="currecyCard" elevation="8">
      <v-list-item
        three-line
        class="pa-2 rounded-lg"
        @click="$router.push(`/currency?id=${currency.id}`)"
      >
        <v-list-item-content class="pa-1">
          <div class="d-flex">
            <v-img :src="currency.logo" :max-width="20"></v-img>
            <span class="mt-1 ml-1 curr_name">{{ currency.symbol }}</span>
          </div>
          <span class="price-text">${{ currency.price }}</span>
        </v-list-item-content>
        <v-list-item-content class="coinList pa-1 flexNone">
          <div class="chip">24H</div>
          <span :style="customStyles" :class="diffColor(currency.change_p)"
            >{{ currency.change_p }}%</span
          >
        </v-list-item-content>
      </v-list-item>
    </v-card>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import config from "~/config/config.json";
import sparklines from "@/components/elements/currencies/Sparklines";
export default {
  components:{
    sparklines
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
      console.log(currency.name);
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
  border-radius: 20px;
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
    border-radius: 20px;
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
  background: -webkit-linear-gradient(36deg, var(--red), #000000) ;
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
  text-align: center;
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
</style>
