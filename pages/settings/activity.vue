<template>
  <div>
    <h2>Account Activity Records</h2>
    <br />
    <v-card>
      <v-data-table
        :headers="headers"
        :items="logs"
        :items-per-page="5"
        :loading="loader"
        class="elevation-1"
      >
        <template v-slot:[`item.fat`]="{ item }">
          <div class="d-flex">
            <p style="color: #01bac6">{{ item.name }}</p>
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
          text: "Date",
          align: "start",
          value: "created_at",
        },
        { text: "Source", value: "device" },
        { text: "Status", value: "status" },
        { text: "IP Address", value: "ip" },
      ],
      active_devs: [],
      logs: [],
      loader: false
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
    init_logs() {
      this.logs = this.logs_all.map(el => {
        let fnd = this.active_devs.find(e => e && e.id == el.id);
        if (fnd) {
          el.status = "active";
        } else {
          el.status = "not active";
        }
        return el;
      })
    }
  },
  async created() {
    this.loader = true;
    await this.fetchLogs();
    let res = await this.$axios.get("api/platform/log_registration/active");
    this.active_devs = res && res.data ? res.data.data : [];
    this.init_logs();
    this.loader = false;
    console.log("this.logs", this.logs, this.active_devs);
  },
};
</script>

<style scoped>
</style>