<template>
  <div class="mx-6 my-2">
    <h2>{{ current.title }}</h2>
    <img class="img-new" :src="current.image" max-height="400" />
    <p>{{ current.content }}</p>
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
};
</script>
<style>
.img-new {
  max-height: 400px;
  min-height: 200px;
}
</style>