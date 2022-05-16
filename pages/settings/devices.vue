<template>
  <div>
    <h2>Device management</h2>
    <br />
    <v-card>
      <v-data-table
        :headers="headers"
        :items="active_devs"
        :items-per-page="5"
        class="elevation-1"
        :loading="loader"
      >
        <template v-slot:[`item.location`]="{}">
          <span>Kyiv</span>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <div class="d-flex">
            <span
              class="primary--text"
              style="cursor: pointer"
              @click="delete_dev(item.id)"
              >Delete</span
            >
          </div>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "DeviceManagment",
  data() {
    return {
      headers: [
        {
          text: "Device",
          align: "start",
          value: "device",
        },
        { text: "Date", value: "created_at" },
        { text: "Location", value: "location" },
        { text: "IP Address", value: "ip" },
        { text: "Action", value: "actions" },
      ],
      active_devs: [],
      loader: false,
    };
  },
  computed: {
    ...mapGetters("data/log_registration", {
      logs_all: "list",
    }),
  },
  methods: {
    ...mapActions("data/log_registration", {
      fetchLogs: "fetchList",
    }),
    async delete_dev(id) {
      this.loader = true;
      await this.$axios.delete(`api/platform/log_registration/${id}`);
      let res = await this.$axios.get("api/platform/log_registration/active");
      this.active_devs = res && res.data ? res.data.data : [];
      this.loader = false;
    },
    async init() {
      this.loader = true;
      let res = await this.$axios.get("api/platform/log_registration/active");
      this.active_devs = res && res.data ? res.data.data : [];
      this.loader = false;
    },
  },
  async created() {
    await this.init();
  },
};
</script>

<style scoped>
</style>