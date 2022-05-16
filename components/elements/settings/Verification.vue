<template>
  <div>
    <div class="privateInformation">
      <p class="text-h6 font-weight-bold">{{ $t("verification") }}</p>
      <v-card class="mainCard pa-5">
        <v-container>
          <v-row>
            <v-col>
              <v-card class="pa-5">
                <h4>{{ $t("s1_basic_verification") }}</h4>
                <p class="text-gray--text">{{ $t("verify_user_data") }}</p>
                <p class="text-gray--text">
                  {{ $t("daily_withdrawal_limit") }}
                </p>
                <p class="success_text--text">50BTC</p>
                <identification></identification>
              </v-card>
            </v-col>
            <v-col>
              <v-card class="pa-5">
                <h4>{{ $t("s2_residency_verify") }}</h4>
                <p class="text-gray--text">
                  {{ $t("residency_verify_address") }}
                </p>
                <p class="text-gray--text">
                  {{ $t("daily_withdrawal_limit") }}
                </p>
                <p class="success_text--text">100BTC</p>
                <v-btn
                  class="success-btn"
                  elevation="0"
                  disabled
                  :style="customStyle"
                  >{{ $t("verify_now") }}</v-btn
                >
              </v-card>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-card class="pa-5">
                <h4 class="success_text--text">{{ $t("disclaimer") }}</h4>
                <p class="text-gray--text">
                  {{ $t("disclaimer_description") }}
                </p>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </div>
  </div>
</template>

<script>
import identification from "@/components/elements/modals/Identification";
import config from "~/config/config.json";
export default {
  name: "privateInformation",
  components: {
    identification,
  },
  data() {
    return {
      primary: config.colors.text.primary,
      dark_disabled: config.colors.dark_disabled_primary_btn,
      light_disabled: config.colors.light_disabled_primary_btn,
    };
  },
  computed: {
    customStyle() {
      return {
        "--primary": this.primary,
        "--dark_disabled": this.dark_disabled,
        "--light_disabled": this.light_disabled,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
html[theme="dark"] .success-btn {
  background: var(--primary) !important;
  border: solid 2px var(--primary) !important;
  color: white !important;
  border-radius: 10px;
  &:disabled {
    cursor: not-allowed;
    background: linear-gradient(
        0deg,
        var(--dark_disabled),
        var(--dark_disabled)
      ),
      var(--primary) !important;
    border: none !important;
  }
}
html[theme="light"] .success-btn {
  background: var(--primary) !important;
  border: solid 2px var(--primary) !important;
  color: white !important;
  border-radius: 10px;
  &:disabled {
    cursor: not-allowed;
    background: linear-gradient(
        0deg,
        var(--light_disabled),
        var(--light_disabled)
      ),
      var(--primary) !important;
    border: none !important;
  }
}
</style>
