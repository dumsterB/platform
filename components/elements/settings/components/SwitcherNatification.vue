<template>
  <div>
    <p class="text-h6 mb-4 font-weight-bold">
      {{ $t("settings_notification") }}
    </p>
    <v-card style="width: 100%" class="pa-4">
      <p class="text-gray--text switch" style="font-size: 14px">
        {{ $t("settings_notification_description") }}
      </p>
      <div class="d-flex align-center ml-2">
        <h2 class="ma-0 mr-2 switch switch_action">{{ $t("off") }}</h2>
        <v-switch
          class="ma-0"
          v-model="switcher"
          color="success"
          hide-details
        ></v-switch>
        <h2 class="ma-0 mr-2 switch switch_action">{{ $t("on") }}</h2>
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "SwitcherNatification",
  data() {
    return {
      switcher: "",
    };
  },
};
</script>

<style lang="scss" scoped>
.switch {
  letter-spacing: -1px !important;
  font-weight: 400;
  font-size: 14px;
  line-height: 16px;
  &_action {
    font-weight: 700;
    font-size: 18px;
    line-height: 22px;
  }
}
</style>
