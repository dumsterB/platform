<template>
  <div>
    <div class="settingsTab" v-if="currentContent === 0">
      <p class="text-h6 ml-4 font-weight-bold">{{ $t("settings_page") }}</p>
      <div class="content ma-4">
        <div
          @click="tabHandler(item)"
          v-for="item of selections"
          :key="item.text"
        >
          <v-card
            :class="item.active ? 'tabs-setting-active' : 'tabs-setting'"
            :style="customStyle"
          >
            <h3 class="tab-btn text-left ml-3 mt-1 text">
              {{ $t(item.title) }}
            </h3>
            <p class="text-left ml-3 mt-1" v-if="item.text !== 'unverified'">
              {{ $t(item.text) }}
            </p>
            <p class="text-left ml-3 mt-1 warning--text d-flex" v-else>
              <img height="20" src="@/static/img/unverified_icon.png" alt="" />
              {{ $t(item.text) }}
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
  name: "settingsTab",
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
    ...mapGetters({ storeSelections: "data/settings/selections" }),
    selections() {
      return JSON.parse(JSON.stringify(this.storeSelections));
    },
    title1() {
      return this.$t("account_settings");
    },
    text1() {
      return this.$t("personal_information");
    },
    title2() {
      return this.$t("security");
    },
    text2() {
      return this.$t("password_and_2mfa");
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
    ...mapMutations({ changeActive: "data/settings/changeActive" }),
    tabHandler(val) {
      console.log("val :>> ", val);
      this.changeActive(val.id);
    },
  },
};
</script>

<style lang="scss" scoped>
.tabs-setting {
  height: 80px !important;
  text-align: center;
  cursor: pointer;
  align-items: center;
  align-content: center;
  display: block !important;
  margin-top: 10px;
  padding: 8px;
  letter-spacing: -1px;
}
html[theme="light"] .tabs-setting {
  filter: drop-shadow(20px 20px 100px var(--light_drop_shadow));
}
html[theme="dark"] .tabs-setting {
  filter: drop-shadow(20px 20px 100px var(--dark_drop_shadow));
}
.tabs-setting-active {
  height: 80px !important;
  text-align: center;
  cursor: pointer;
  align-items: center;
  align-content: center;
  display: block !important;
  margin-top: 10px;
  padding: 8px;
  background: var(--primary) !important;
  color: white !important;
  letter-spacing: -1px;
}

html[theme="light"] .tabs-setting-active {
  height: 80px !important;
  text-align: center;
  cursor: pointer;
  align-items: center;
  align-content: center;
  display: block !important;
  margin-top: 10px;
  padding: 8px;
  background: var(--primary) !important;
  color: white !important;
  letter-spacing: -1px;
}
</style>
