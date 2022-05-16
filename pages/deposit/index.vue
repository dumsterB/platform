<template>
  <div>
    <v-container>
      <v-row no-gutters>
        <v-col cols="12" lg="2" md="2">
          <SwitchTabs
            @change_content="change_content"
            :currentContent="currentContent"
          ></SwitchTabs>
        </v-col>
        <v-col cols="12" lg="4" md="4" class="mt-6">
          <component
            :currentContent="currentContent"
            @change_content="change_content"
            :is="component"
          ></component>
        </v-col>
        <v-col cols="12" lg="6" md="6" class="mt-6">
          <TableOrders></TableOrders>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import SwitchTabs from "@/components/elements/deposit/SwitchTabs";
import Crypto from "@/components/elements/deposit/Crypto";
import CreditDebit from "@/components/elements/deposit/CreditDebit";
import Others from "@/components/elements/deposit/Others";
import TableOrders from "@/components/data/TableOrders";

import { mapGetters } from "vuex";
export default {
  name: "Deposit",
  data() {
    return {
      currentComponent: "",
      currentContent: 0,
    };
  },
  components: {
    SwitchTabs,
    Crypto,
    CreditDebit,
    Others,
    TableOrders,
  },
  computed: {
    ...mapGetters({
      selections: "data/deposit/selections",
      componentHandler: "data/deposit/componentHandler",
    }),
    component() {
      this.componentHandler;
      try {
        return () =>
          import(`@/components/elements/deposit/${this.componentHandler}`);
      } catch (e) {
        return null;
      }
    },
  },
  methods: {
    change_content(val) {
      this.currentContent = val;
    },
  },
  mounted() {},
};
</script>
<style lang="scss"></style>
