<template>
  <div>
    <div v-if="currentContent === 0">
      <p class="text-h6 font-weight-bold">{{ $t("deposit") }}</p>
      <div class="content ma-0 mr-4">
        <div
          @click="tabHandler(item)"
          v-for="item of selections"
          :key="item.text"
          class="mb-6"
        >
          <v-card
            :class="item.active ? 'tabs-setting-active' : 'tabs-setting'"
            :style="customStyle"
            class="px-6 pt-2"
          >
            <p class="tab-btn text-left ml-0 mt-1">
              {{ $t(item.title) }}
            </p>
            <p class="text-left ml-0 mt-1 tab-desc">
              {{ $t("some_min") }}
            </p>
          </v-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import config from "~/config/config.json";

export default {
  name: "SwitchTabs",
  props: {
    currentContent: {},
  },
  data() {
    return {
      light_drop_shadow: config.themes.light.drop_shadow,
      dark_drop_shadow: config.themes.dark.drop_shadow,
      primary: config.colors.text.primary,
    };
  },
  computed: {
    ...mapGetters({ storeSelections: "data/deposit/selections" }),
    selections() {
      return JSON.parse(JSON.stringify(this.storeSelections));
    },
    customStyle() {
      return {
        "--light_drop_shadow": this.light_drop_shadow,
        "--dark_drop_shadow": this.dark_drop_shadow,
        "--primary": this.primary,
      };
    },
  },
  methods: {
    ...mapMutations({ changeActive: "data/deposit/changeActive" }),
    tabHandler(val) {
      this.changeActive(val.id);
    },
  },
};
</script>

<style lang="scss" scoped>
.tabs-setting {
  height: 90px !important;
  display: block !important;
  letter-spacing: -1px;
  font-weight: 700;
  font-size: 18px;
  line-height: 22px;
  &:hover {
    cursor: pointer;
  }
}
html[theme="light"] .tabs-setting {
  filter: drop-shadow(20px 20px 100px var(--light_drop_shadow));
}
html[theme="dark"] .tabs-setting {
  filter: drop-shadow(20px 20px 100px var(--dark_drop_shadow));
}
.tabs-setting-active {
  height: 90px !important;
  display: block !important;
  background: var(--primary) !important;
  color: white !important;
  font-weight: 700;
  font-size: 18px;
  line-height: 22px;
  letter-spacing: -1px;
}

html[theme="light"] .tabs-setting-active {
  height: 90px !important;
  display: block !important;
  background: var(--primary) !important;
  color: white !important;
  font-weight: 700;
  font-size: 18px;
  line-height: 22px;
  letter-spacing: -1px;
}
.tab-desc {
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0px;
}
</style>
