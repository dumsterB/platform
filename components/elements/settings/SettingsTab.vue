<template>
  <div>
  <div class="settingsTab" v-if="currentContent===0">
    <p class="text-h6 ml-4">{{ $t("settings_page") }}</p>
    <div class="content ma-4 settingDesktop">
      <div
        @click="tabHandler(item)"
        v-for="item of selections"
        :key="item.text"
      >
        <v-card
          :class="item.active ? 'tabs-setting not-global' : 'tabs-setting'"
          :style="item.active ? 'background: #007BFF !important; color: white' : ''"
        >
          <h3 class="tab-btn text-left ml-3 mt-1 text">{{ $t(item.title) }}</h3>
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
<!--    <div class="content ma-4 settingMobile">
      <div
          @click="tabHandler(item)"
          v-for="item of selections"
          :key="item.text"
      >
        <v-card
            :class="item.active ? 'tabs-setting not-global' : 'tabs-setting'"
            :style="item.active ? 'background: #007BFF !important; color: white' : ''"
        >
          <h3 class="tab-btn text-left ml-3 mt-1 text">{{ $t(item.title) }}</h3>
          <p class="text-left ml-3 mt-1" v-if="item.text !== 'unverified'">
            {{ $t(item.text) }}
          </p>
          <p class="text-left ml-3 mt-1 warning&#45;&#45;text d-flex" v-else>
            <img height="20" src="@/static/img/unverified_icon.png" alt="" />
            {{ $t(item.text) }}
          </p>
        </v-card>
      </div>
    </div>-->
  </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import config from "~/config/config.json";

export default {
  name: "settingsTab",
  props:{
    currentContent:{}
  },
  data() {
    return {
      start_gradient: config.themes.dark.start_gradient,
      end_gradient: config.themes.dark.end_gradient,
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
  height: 80px !important;
  text-align: center;
  cursor: pointer;
  align-items: center;
  align-content: center;
  display: block !important;
  margin-top: 10px;
  padding: 8px;
  filter: drop-shadow(20px 20px 100px rgba(0, 0, 0, 0.5));
}
</style>
