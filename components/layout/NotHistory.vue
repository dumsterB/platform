<template>
  <v-card width="350" class="pa-4 light-card">
    <h4 class="mb-4 ml-2 font-weight-medium">Notifications</h4>
    <div
      v-for="(not, i) in notifications"
      :key="i"
      class="not-block mb-4 px-5 py-3"
    >
      <span>
        <v-badge class="ml-1 mr-2" color="#E20000"></v-badge
        ><span class="not-title ml-4">{{ not.title }}</span>
      </span>
      <p class="not-text mt-2">{{ not.text }}</p>
    </div>
  </v-card>
</template>
<script>
import { mapGetters, mapActions, mapMutations } from "vuex";

export default {
  data() {
    return {
      notifications: [
        {
          title: "Welcome to Platform",
          text: "Welcome to Platform. Trade cryptocurrencies here.",
        },
        {
          title: "Welcome to Platform",
          text: "Welcome to Platform. Trade cryptocurrencies here.",
        },
        {
          title: "Welcome to Platform",
          text: "Welcome to Platform. Trade cryptocurrencies here.",
        },
      ],
    };
  },
  methods: {
    ...mapActions("data/notifications_history", {
      fetchNots: "fetchList",
    }),
  },

  watch: {},

  components: {},

  computed: {
    ...mapGetters("data/notifications_history", {
      not_list: "list",
    }),
  },
  mounted() {},
  async created() {
    await this.fetchNots();
    console.log('this.not_list', this.not_list);
  },
};
</script>

<style lang="scss">
.not-block {
  background-color: rgba(255, 255, 255, 0.05) !important;
  border-radius: 10px;
}
.not-title {
  font-weight: 700;
  font-size: 14px;
}
.not-text {
  font-weight: 400;
  font-size: 12px;
}
</style>
