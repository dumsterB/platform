<template>
  <div>
    <v-dialog v-model="dialog" width="800">
      <template v-slot:activator="{ on, attrs }">
        <div v-bind="attrs" v-on="on">
          <v-btn dark elevation="0" :style="customStyle" class="success-btn">{{
            $t("change")
          }}</v-btn>
        </div>
      </template>
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          {{ $t("change_your_password") }}
        </v-card-title>
        <div class="pa-5">
          <v-divider></v-divider>
          <v-col>
            <v-text-field
              :label="$t('old_password')"
              @click:suffix="GetCodePhoneNumber"
            ></v-text-field>
          </v-col>
          <h4>{{ $t("security_check") }}</h4>
          <v-col>
            <v-text-field
              :label="$t('new_password')"
              @click:suffix="GetCodePhoneNumber"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              :label="$t('confirm_password')"
              @click:suffix="GetCodePhoneNumber"
            ></v-text-field>
          </v-col>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="dialog = false">
              {{ $t("send") }}
            </v-btn>
          </v-card-actions>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import config from "~/config/config.json";
export default {
  name: "securityModal",
  data() {
    return {
      start_gradient: config.themes.dark.start_gradient,
      end_gradient: config.themes.dark.end_gradient,
    };
  },
  props: {
    dialog: {
      type: Boolean,
    },
  },
  methods: {
    GetCodePhoneNumber() {
      console.log("clicked");
    },
  },
  computed: {
    customStyle() {
      return {
        "--start_gradient": this.start_gradient,
        "--end_gradient": this.end_gradient,
      };
    },
  },
};
</script>

<style scoped>
.success-btn {
  background: linear-gradient(
    94.9deg,
    var(--start_gradient) 4.26%,
    var(--end_gradient) 95.87%
  );
  color: white !important;
}
</style>
