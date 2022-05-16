<template>
  <div>
    <div class="arbitage">
      <v-row>
        <v-col :cols="12" :md="8" :lg="8" :sm="12" :xs="12">
          <div
            class="d-flex mt-2 mdc-form-field--space-between justify-content-beetween currencyNavbar"
          >
            <div>
              <p class="text-h6 ml-5">{{ $t("arbitrage_page") }}</p>
            </div>
          </div>
        </v-col>
      </v-row>
      <Arbitage class="ml-1 mr-1"></Arbitage>
    </div>
  </div>
</template>

<script>
import Arbitage from "../../components/elements/Arbitage";
export default {
  components: {
    Arbitage,
  },
  mounted() {},
};
</script>
