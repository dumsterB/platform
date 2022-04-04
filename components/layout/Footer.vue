<template>
  <v-footer v-bind="localAttrs" :padless="padless" class="pa-0 mt-4">
    <v-card flat tile width="100%" class="text-center">
      <v-card-text class="primary--text pa-1">
        {{ new Date().getFullYear() }} — <strong>{{ config.name }}</strong>
      </v-card-text>
    </v-card>
  </v-footer>
</template>

<script>
import config from "~/config/config.json";
export default {
  data: () => ({
    icons: [
      "mdi-home-outline",
      "mdi-email-outline",
      "mdi-calendar-outline",
      "mdi-delete-outline",
    ],
    config: config,
    items: ["default", "absolute", "fixed"],
    padless: true,
    variant: "absolute",
  }),
  computed: {
    localAttrs() {
      const attrs = {};

      if (this.variant === "default") {
        attrs.absolute = false;
        attrs.fixed = false;
      } else {
        attrs[this.variant] = true;
      }
      return attrs;
    },
  },
};
</script>

<style lang="scss" scoped></style>
