<template>
  <div>
    <v-snackbar
      v-for="(item, i) in items"
      :key="i"
      :color="item.color"
      right
      top
      :value="true"
      :style="`top: ${80 * i}px`"
    >
      <div class="main-msg">
        <div>
          <h3>{{ item.title }}</h3>
          <div>{{ item.text }}</div>
        </div>
        <div class="action-button">
          <v-btn @click="removeItem(item.id)" text icon>
            <v-icon>{{ closeButtonIcon }}</v-icon>
          </v-btn>
        </div>
      </div>
    </v-snackbar>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      timeout: 5000,
      nextButtonText: "Next",
      closeButtonIcon: "mdi-close",
      processing: false,
      timeoutId: false,
      timeouts: [],
    };
  },
  created() {},
  computed: {
    ...mapGetters("data/notifications", {
      items: "allMessages",
    }),
  },
  watch: {
    items() {
      this.processItems();
    },
  },
  methods: {
    processItems() {
      const vm = this;
      vm.processing = true;
      if (vm.items && Array.isArray(vm.items) && vm.items.length > 0) {
        // vm.item = vm.items[vm.items.length - 1];
        // for (let i = 0; i < vm.items.length - 1; i++) {
        //   vm.removeItem(vm.items[i].id);
        // }
        for (let i = 0; i < vm.items.length; i++) {
          let item = vm.items[i];
          let timeout = item && item.timeout ? item.timeout : vm.timeout;
          let fnd = this.timeouts.find((el) => el == item.id);
          if (!fnd) {
            this.timeouts.push(item.id);
            setTimeout(() => {
              if (item && item.id) {
                vm.removeItem(item.id);
              }
            }, timeout);
          }
        }
      } else {
        this.item = null;
      }
      vm.processing = false;
    },
    addItem(title, message) {
      let item = {
        title: title,
        text: message,
        color: "error",
      };
      this.$store.commit("data/notifications/create", item);
    },
    removeItem(id) {
      const vm = this;
      this.$store.commit("data/notifications/remove", id);
      if (vm.items.length > 0) {
        return vm.processItems();
      }
    },
    uniqueId: (prefix) => `${prefix}_` + Math.random().toString(36),
  },
};
</script>
<style scoped>
.main-msg {
  display: grid;
  grid-template-columns: 1fr 150px;
}
.action-button {
  text-align: right;
}
</style>