<template>
  <div>
    <v-tooltip v-if="tooltip" bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-card
          class="currecyCard"
          elevation="3"
          v-bind="attrs"
          v-on="on"
          :width="220"
          :class="diffColor(currency.change_p)"
        >
          <v-list-item
            three-line
            class="pa-2"
            @click="$router.push(`/currency?id=${currency.id}`)"
          >
            <v-list-item-content class="pa-1">
              <div class="d-flex">
                <v-img :src="currency.logo" :max-width="20"></v-img>
                <span class="mt-1 ml-1 curr_name">{{ currency.symbol }}</span>
              </div>
              <span style="margin-bottom: -4px">${{ currency.price }}</span>
            </v-list-item-content>
            <v-list-item-content class="coinList pa-1 flexNone">
              <div class="star-btn">
                <v-btn icon>
                  <v-icon
                    @click.prevent.stop="handlerSelection"
                    size="30"
                    v-if="star_selection"
                    style="color: yellow"
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
              <span>{{ currency.change_p }}%</span>
            </v-list-item-content>
          </v-list-item>
        </v-card>
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
    <v-card v-else class="currecyCard" elevation="3" :width="220">
      <v-list-item
        three-line
        class="pa-2"
        @click="$router.push(`/currency?id=${currency.id}`)"
      >
        <v-list-item-content class="pa-1">
          <div class="d-flex">
            <v-img :src="currency.logo" :max-width="20"></v-img>
            <span class="mt-1 ml-1 curr_name">{{ currency.symbol }}</span>
          </div>
          <span>${{ currency.price }}</span>
        </v-list-item-content>
        <v-list-item-content class="coinList pa-1 flexNone">
          <div class="chip">24H</div>
          <span :style="diffColor(currency.change_p)"
            >{{ currency.change_p }}%</span
          >
        </v-list-item-content>
      </v-list-item>
    </v-card>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
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
  },
  methods: {
    diffColor(diff) {
      if (diff < 0) {
        return "back-failure";
      } else {
        return "back-success";
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
.coinList .chip {
  // toolbar background
  background-color: #3d3d3d;
  padding: 1px;
  text-align: center;
  font-size: 13px;
  border-radius: 20px;
  width: 5px !important;
}
.currecyCard {
  cursor: pointer;
}
.star_btn:hover {
  background: none;
}
html[theme="light"] {
  .chip {
    // toolbar background
    background-color: #ebebeb;
  }
}
.star-btn {
  text-align: center;
  width: 40px;
}
</style>
