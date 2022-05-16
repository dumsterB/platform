<template>
  <div>
    <v-dialog v-model="dialog" width="800">
      <template v-slot:activator="{ on, attrs }">
        <div v-bind="attrs" v-on="on">
          <v-btn
            dark
            elevation="0"
            :style="customStyle"
            class="success-btn font-weight-bold text-none"
            >{{ $t("delete_btn") }}</v-btn
          >
        </div>
      </template>
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          {{ $t("email_change") }}
        </v-card-title>
        <div class="pa-5">
          <h4>{{ $t("new_email_verify") }}</h4>
          <v-divider></v-divider>
          <v-col>
            <v-text-field :label="$t('new_email_address')"></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              :label="$t('new_email_verification_code')"
              :suffix="$t('get_code')"
              @click:suffix="GetCodePhoneNumber"
            ></v-text-field>
          </v-col>
          <h4>{{ $t("security_check") }}</h4>
          <v-col>
            <v-text-field
              :label="$t('email_verification_code')"
              :suffix="$t('get_code')"
              @click:suffix="GetCodePhoneNumber"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              :label="$t('phone_verification_code')"
              :suffix="$t('get_code')"
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
      primary: config.colors.text.primary,
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
        "--primary": this.primary,
      };
    },
  },
};
</script>

<style scoped>
.success-btn {
  background: var(--primary) !important;
  border: solid 2px var(--primary) !important;
  color: white !important;
  border-radius: 10px;
}
</style>
