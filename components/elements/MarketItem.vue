<template>
  <v-card class="pl-0 pr-0 mb-2 ml-2 mr-2" :width="380">
    <div style="cursor: pointer" @click="handlerOpenMarketPage">
      <div class="d-flex justify-space-between">
        <v-card-title class="text-uppercase">{{ `${item.name}` }}</v-card-title>
        <v-btn fab icon class="ma-5 pa-1">
          <v-icon
            @click.prevent.stop="togglerFavorite"
            size="40"
            v-if="isFavorite"
            color="yellow"
            >mdi-star</v-icon
          >
          <v-icon
            @click.prevent.stop="togglerFavorite"
            size="35"
            v-if="!isFavorite"
            class="yellow--text"
            >mdi-star-outline</v-icon
          >
        </v-btn>
      </div>

      <v-list class="mt-4 mr-4 mb-4 ml-4">
        <v-list-item class="" disabled v-for="(cur, i) in currencies" :key="i">
          <v-list-item-avatar>
            <v-img v-bind:src="cur.logo"></v-img>
          </v-list-item-avatar>
          <v-list-item-content v-text="cur.name"></v-list-item-content>
          $<v-list-item-content
            v-text="prices[cur.symbol]"
          ></v-list-item-content>
        </v-list-item>
      </v-list>
    </div>
  </v-card>
</template>

<script>
export default {
  name: "MarketItem",
  data() {
    return {
      isFavorite: false,
    };
  },
  computed: {},
  props: {
    item: {
      type: Object,
      default: () => {
        return {};
      },
    },
    prices: {
      type: Object,
      default: () => {
        return {};
      },
    },
    currencies: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  methods: {
    togglerFavorite() {
      this.isFavorite = !this.isFavorite;
    },
    handlerOpenMarketPage() {
      this.$router.push({
        path: `/markets/${this.item.id}`,
      });
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped></style>
