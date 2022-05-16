<template>
  <div>
    <v-row>
      <v-col>
        <v-row class="ml-2 mr-2">
          <v-col
            class="d-flex justify-center mt-4"
            :xl="3"
            :lg="4"
            :md="6"
            :sm="6"
            :cols="12"
            v-for="article in news"
            :key="article.articleId"
          >
            <NewsItem :item="article" />
          </v-col>
        </v-row>
        <v-col
          v-if="news && news.length > 0"
          class="d-flex justify-center mt-4"
        >
          <v-btn x-large outlined>{{ $t("view_more") }}</v-btn>
        </v-col>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import NewsItem from "~/components/elements/NewsItem";
import { mapGetters, mapActions } from "vuex";
const model = "data/news";

export default {
  components: {
    NewsItem,
  },
  computed: {
    ...mapGetters(model, {
      news: "news",
    }),
  },
  methods: {
    ...mapActions(model, {
      fetchNews: "fetchNews",
    }),
  },
  async mounted() {
    if (!this.news || this.news.length == 0) {
      await this.fetchNews();
    }
    console.log("this.news", this.news)
  },
};
</script>
<style>
.btn-load {
  top: 200px;
}
</style>
