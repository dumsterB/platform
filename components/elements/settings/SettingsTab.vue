<template>
  <div class="settingsTab">
    <p class="text-h6 ml-4">{{ $t("settings_page") }}</p>
    <div class="content ma-4">
      <v-card
        :style="customStyle"
        :class="item.active ? 'tabs-active tabs-setting' : 'tabs-setting'"
        @click="tabHandler(item)"
        v-for="item of selections"
        :key="item.text"
      >
        <h3 class="tab-btn text">{{ $t(item.title) }}</h3>
        <p>{{ $t(item.text) }}</p>
      </v-card>
      <p class="text-h6 mt-6 success_text--text">
        {{ $t("settings_notification") }}
      </p>
      <p class="text-gray--text">
        {{ $t("settings_notification_description") }}
      </p>
      <v-switch
        v-model="switcher"
        :label="!switcher ? `${$t('on')}` : `${$t('off')}`"
        color="success"
      ></v-switch>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import config from "~/config/config.json";

export default {
  name: "settingsTab",
  data() {
    return {
      start_gradient: config.themes.dark.start_gradient,
      end_gradient: config.themes.dark.end_gradient,
      switcher: "",
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
        "--start_gradient": this.start_gradient,
        "--end_gradient": this.end_gradient,
      };
    },
  },
  methods: {
    ...mapMutations({ changeActive: "data/settings/changeActive" }),
    tabHandler(val) {
      this.changeActive(val.id);
    },
  },
};
</script>

<style scoped>
.tabs-setting {
  width: 320px;
  height: 80px !important;
  text-align: center;
  cursor: pointer;
  align-items: center;
  align-content: center;
  display: block !important;
  margin-top: 10px;
  padding: 8px;
}
.tabs-active {
  background: linear-gradient(
    94.9deg,
    var(--start_gradient) 4.26%,
    var(--end_gradient) 95.87%
  );
  color: white;
}
</style>
