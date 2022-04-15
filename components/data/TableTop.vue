<template>
  <v-data-table
    :items="list"
    :headers="headers"
    :items-per-page="10"
    class="ma-4 ml-8 curr-table"
    :footer-props="{
      'items-per-page-options': [5, 10, 20, 50],
    }"
  ></v-data-table>
</template>
<script>
export default {
  data() {
    return {
      list: [],
    };
  },
  computed: {
    headers() {
      return [
        {
          text: this.$t("name_table"),
          value: "name",
          width: 100,
        },
        {
          text: this.$t("change"),
          value: "price",
          width: 100,
        },
      ];
    },
  },
};
</script>
<style>
.curr-table {
  background-color: transparent !important;
}
</style>