<template>
  <v-card class="mx-auto" min-height="580" style="border-radius: 12px">
    <v-img class="white--text align-end" height="200px" :src="item.image_url">
    </v-img>
    <v-card-title class="success_text--text">{{ item.title }}</v-card-title>
    <v-card-text class="gray--text">
      <div>{{ item.description }}</div>
    </v-card-text>
    <v-card-actions
      class="bottom-new d-flex justify-space-between align-center"
      style="width: 100%"
    >
      <v-card-subtitle> {{ item.pubDate }}</v-card-subtitle>
      <v-btn @click="handlerOpenArticle" class="primary--text" text>
        {{ $t("read_more") }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
// import config from "~/config/config.json";

export default {
  name: "NewsItem",
  props: {
    item: {
      type: Object,
      default: {},
    },
  },
  // data() {
  //   return { defaultColor: config.colors.text.primary };
  // },

  methods: {
    handlerOpenArticle: function () {
      window.open(this.item.link, "_blank").focus();
    },
  },
  mounted() {},
};
</script>
<style lang="scss">
.bottom-new {
  position: absolute;
  bottom: 0;
}
</style>
