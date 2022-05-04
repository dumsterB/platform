<template>
  <v-card width="350" class="pa-4 light-card">
    <h4 class="mb-4 ml-2 font-weight-medium">Notifications</h4>
    <div
      v-for="(not, i) in notifications"
      :key="i"
      class="not-block mb-4 px-5 py-3"
    >
      <v-row>
        <v-col :cols="9">
          <v-badge class="ml-1 mr-2" color="#E20000"></v-badge
          ><span class="not-title ml-4">{{ not.title }}</span>
        </v-col>
        <v-col class="text-right" :cols="3">
          <span class="note-date">{{ not.ago }}</span>
        </v-col>
      </v-row>
      <p class="not-text mt-2">{{ not.text }}</p>
    </div>
  </v-card>
</template>
<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import moment from "moment";

export default {
  data() {
    return {
      //   notifications: [
      //     {
      //       title: "Welcome to Platform",
      //       text: "Welcome to Platform. Trade cryptocurrencies here.",
      //     },
      //   ],
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
    notifications() {
      return this.not_list.map((el) => {
        el.ago = moment(el.created_at).fromNow(true);
        return el;
      });
    },
  },
  mounted() {},
  async created() {
    await this.fetchNots();
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
.note-date {
  font-weight: 300;
  font-size: 10px;
}
</style>
