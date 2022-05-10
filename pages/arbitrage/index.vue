<template>
  <div>
    <div class="arbitage">
      <v-row>
        <v-col :cols="12" :md="8" :lg="8" :sm="12" :xs="12">
          <div
            class="d-flex mt-2 mdc-form-field--space-between justify-content-beetween currencyNavbar"
          ></div>
        </v-col>
      </v-row>
      <Arbitage></Arbitage>
    </div>
  </div>
</template>

<script>
import Arbitage from "~/components/elements/Arbitage";
export default {
  components: {
    Arbitage,
  },
  mounted() {},
};
</script>
