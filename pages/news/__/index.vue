<template>
  <div class="mx-6 my-2">
    <img class="img-new mb-4" :src="current.image" max-height="400" />
    <h2 class="mb-4 text-left">{{ current.title }}</h2>
    <v-row>
      <v-col cols="3" class="mb-6">
        <p class="font-weight-bold success--text">
          {{ new Date(current.publishedAt).toLocaleString() }}
        </p>
      </v-col>
      <v-col cols="4" class="text-right d-flex mb-6">
        <!-- :href="current.source.url" target="_blank" -->
        <span
          ><span class="white--text">{{ $t("source") }}: </span
          >{{ current.source.name }}</span
        >
      </v-col>
    </v-row>
    <p class="text-left mb-4">{{ current.description }}</p>
    <p class="text-left">{{ current.content }}</p>
  </div>
</template>
<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters("data/news", {
      article: "article",
    }),
    current() {
      let id = this.$route.params._;
      let dt = this.article(id);
      if (dt) {
        return dt;
      } else {
        this.$router.push({
          path: "/news",
        });
      }
      return this.article(id);
    },
  },
  mounted() {
    console.log("this.article :>> ", this.article(1));
  },
};
</script>
<style>
.img-new {
  max-height: 400px;
  min-height: 200px;
  border-radius: 10px;
}
</style>
