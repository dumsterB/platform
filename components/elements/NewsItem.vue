<template>
  <v-hover v-slot="{ hover }" open-delay="223" close-delay="223">
    <v-card
      :elevation="hover ? 18 : 8"
      class="mx-auto mainBorderRadius"
      min-height="450"
    >
      <v-img class="white--text align-end" height="200px" :src="item.image">
      </v-img>
      <v-card-title class="success_text--text description pb-0">{{
        item.title
      }}</v-card-title>
      <v-card-text class="gray--text">
        <div class="description">{{ item.description }}</div>
      </v-card-text>
      <v-card-actions
        class="bottom-new d-flex justify-space-between align-center"
        style="width: 100%"
      >
        <v-card-subtitle>{{ formatedDate }}</v-card-subtitle>
        <v-hover v-slot="{ hover }" open-delay="223" close-delay="223">
          <v-btn
            @click="handlerOpenArticle"
            :class="hover ? 'success_text--text' : 'primary--text'"
            text
          >
            {{ $t("read_more") }}
          </v-btn>
        </v-hover>
      </v-card-actions>
    </v-card>
  </v-hover>
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
  computed: {
    formatedDate() {
      const date = new Date(this.item.publishedAt);
      const minutes =
        date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
      const newsItemDate =
        date.getDate() < 10
          ? `0${date.getDate()}.0${
              date.getMonth() + 1
            }.${date.getFullYear()} ${date.getHours()}:${minutes}`
          : `${date.getDate()}.0${
              date.getMonth() + 1
            }.${date.getFullYear()} ${date.getHours()}:${minutes}`;
      return newsItemDate;
    },
  },
  methods: {
    handlerOpenArticle() {
      this.$router.push({
        path: `/news/${this.item.articleId}`
      });
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
.description {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
