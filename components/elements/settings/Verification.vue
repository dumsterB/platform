<template>
  <div>
    <div class="privateInformation">
      <p class="text-h6">{{ $t("verification") }}</p>
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
                <v-btn elevation="0" disabled>{{ $t("verify_now") }}</v-btn>
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
export default {
  name: "privateInformation",
  components: {
    identification,
  },
};
</script>

<style scoped></style>
