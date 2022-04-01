<template>
  <v-card class="mx-auto" min-height="580" style="border-radius: 12px">
    <v-img class="white--text align-end" height="200px" :src="item.image_url">
    </v-img>
    <v-card-title>{{ item.title }}</v-card-title>
    <v-card-text class="text--primary">
      <div>{{ item.description }}</div>
    </v-card-text>
    <v-card-actions class="bottom-new">
      <v-card-subtitle> {{ item.pubDate }}</v-card-subtitle>
      <v-btn @click="handlerOpenArticle" :color="defaultColor" text>
        {{ $t("read_more") }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import config from "~/config/config.json";

export default {
  name: "NewsItem",
  props: {
    item: {
      type: Object,
      default: {},
    },
  },
  data() {
    return { defaultColor: config.colors.text.primary };
  },

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
