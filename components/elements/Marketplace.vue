<template>
  <v-card tag="section" class="mx-auto ml-4 mr-4 mb-4 pa-3 light-card">
    <div class="d-flex align-center">
      <v-card-title class="text-uppercase" tag="h2">{{
        `${item.name}`
      }}</v-card-title>
      <v-img
        contain
        height="auto"
        max-width="200px"
        v-bind:src="item.logo"
        class=""
      >
      </v-img>
    </div>
    <v-card-subtitle tag="h3" v-text="item.created_at"> </v-card-subtitle>
    <v-card-text tag="p" class="text--primary">
      <div v-text="item.desc"></div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "Marketplace",
  props: {
    item: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped></style>
