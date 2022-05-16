<template>
  <div class="settings">
    <v-container>
      <v-row no-gutters>
        <v-col cols="12" lg="3" md="3" class="pr-4">
          <SettingsTab
            @change_content="change_content"
            :currentContent="currentContent"
          ></SettingsTab>
        </v-col>
        <v-col cols="12" lg="7" md="7" class="pr-1 pl-1">
          <component
            class=""
            :currentContent="currentContent"
            @change_content="change_content"
            :is="component"
          ></component>
        </v-col>
        <v-col cols="12" lg="2" md="2" class="pl-2 pr-2">
          <SwitcherNatification ></SwitcherNatification>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import SettingsTab from "@/components/elements/settings/SettingsTab";
import PrivateInformation from "@/components/elements/settings/PrivateInformation";
import Security from "@/components/elements/settings/Security";
import Verification from "@/components/elements/settings/Verification";
import SwitcherNatification from "../../components/elements/settings/components/SwitcherNatification";
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      currentComponent: "",
      currentContent: 0,
    };
  },
  components: {
    SettingsTab,
    PrivateInformation,
    Security,
    Verification,
    SwitcherNatification,
  },
  computed: {
    ...mapGetters({
      selections: "data/settings/selections",
      componentHandler: "data/settings/componentHandler",
    }),
    component() {
      console.log(this.componentHandler);
      try {
        return () =>
          import(`@/components/elements/settings/${this.componentHandler}`);
      } catch (e) {
        return null;
      }
    },
  },
  methods: {
    ...mapActions("data/log_registration", {
      fetchLogs: "fetchList",
    }),
    change_content(val) {
      console.log("val :>> ", val);
      this.currentContent = val;
    },
  },
  async created() {
    await this.fetchLogs();
  },
};
</script>
<style>
.header-text {
  cursor: pointer;
  color: #9a9a9a;
}
</style>
