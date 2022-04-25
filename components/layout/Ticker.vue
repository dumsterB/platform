<template>
  <v-list class="list">
    <v-list-item-group class="list_group">
      <div class="first">
        <v-list-item
          class="list_group_item"
          v-for="(item, id) in firstHalf"
          :key="id"
        >
          <p class="list_group_item_name">{{ item.poolNmae }}</p>
          <p class="list_group_item_price">{{ item.price }}</p>
          <p
            :style="isDiff(item.priceChange)"
            class="list_group_item_priceChange"
          >
            {{ item.priceChange }}
          </p>
          <p :style="isDiff(item.priceChangePercent)">
            ({{ item.priceChangePercent }}%)
          </p>
        </v-list-item>
      </div>
      <div class="second">
        <v-list-item
          class="list_group_item"
          v-for="(item, id) in secondHalf"
          :key="id"
        >
          <p class="list_group_item_name">{{ item.poolNmae }}</p>
          <p class="list_group_item_price">{{ item.price }}</p>
          <p
            :style="isDiff(item.priceChange)"
            class="list_group_item_priceChange"
          >
            {{ item.priceChange }}
          </p>
          <p :style="isDiff(item.priceChangePercent)">
            ({{ item.priceChangePercent }}%)
          </p>
        </v-list-item>
      </div>
    </v-list-item-group>
  </v-list>
</template>
<script>
import { mapGetters } from "vuex";
import config from "~/config/config.json";
export default {
  data() {
    return {
      config: config.themes.dark,
    };
  },

  methods: {
    isDiff(diff) {
      if (diff < 0) {
        return `color: ${this.config.red};`;
      } else {
        return `color: ${this.config.green};`;
      }
    },
  },

  computed: {
    ...mapGetters({
      ticker: "config/ticker/getTickerData",
    }),
    list() {
      return [...this.ticker];
    },
    middleIndex() {
      return (this.middleIndex = Math.ceil(this.list.length / 2));
    },
    firstHalf() {
      return (this.firstHalf = this.list.splice(0, this.middleIndex));
    },
    secondHalf() {
      return (this.secondHalf = this.list.splice(-this.middleIndex));
    },
  },

  watch: {},
  mounted() {},
};
</script>

<style lang="scss">
$duration: 30s;
.list {
  background-color: transparent !important;
  overflow: hidden !important;
  height: 36px;
  position: relative !important;
  width: 120%;

  &_group {
    display: flex !important;
    flex-direction: row !important;
    justify-content: space-around !important;
    align-items: center !important;
    overflow: hidden !important;
    width: 200%;
    height: 36px;
    &_item {
      margin: 0 28px 0 0;
      font-size: 12px;
      line-height: 14px;
      &_name {
        font-weight: 700;
        margin: 0 6px 0 0;
        color: #9a9a9a;
      }
      &_price {
        font-weight: 400;
        margin: 0 6px 0 0;
        color: #6184ff;
      }
      &_priceChange {
        margin: 0 6px 0 0;
      }
    }
  }
}

.first,
.second {
  transform: translate(110%, 0) !important;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  position: absolute;
  top: 0;
  right: 0;
}
.first {
  animation: ticker ($duration) infinite linear forwards !important;
}
.second {
  animation: ($duration) ticker $duration/2 infinite linear forwards !important;
}

@keyframes ticker {
  0% {
    transform: translate(100%, 0);
  }

  50% {
    transform: translate(0, 0);
  }

  100% {
    transform: translate(-100%, 0);
  }
}
</style>
