<template>
  <div>
    <div class="privateInformation" v-if="currentContent === 0">
      <p class="text-h6 font-weight-bold">{{ $t("security") }}</p>
      <v-card class="mainCard pa-5">
        <div class="list-item d-flex">
          <div>
            <h4 class="fontWeight mb-1">{{ $t("security_keys") }}</h4>
            <span class="text-gray--text font-weight-light">{{
              $t("protect_key")
            }}</span>
          </div>
          <v-spacer></v-spacer>
          <div style="align-items: center; display: flex">
            <v-btn
              dark
              elevation="0"
              :style="customStyle"
              class="success-btn font-weight-bold text-none"
              >{{ $t("enable") }}</v-btn
            >
          </div>
        </div>
        <v-divider class="my-6"></v-divider>
        <div class="list-item d-flex">
          <div>
            <h4 class="fontWeight mb-1">{{ $t("phone_num_verify") }}</h4>
            <span class="text-gray--text font-weight-light">{{
              $t("protect_account")
            }}</span>
          </div>
          <v-spacer></v-spacer>
          <v-checkbox
            class="mr-12"
            style="align-items: center; display: flex"
            v-model="VerificationNumberCheckbox"
            :label="cutPhoneValue(phone)"
          ></v-checkbox>
          <div style="align-items: center; display: flex">
            <v-btn
              elevation="0"
              :style="customStyle"
              class="outlined-btn primary--text font-weight-bold text-none"
              >{{ $t("change") }}</v-btn
            >
          </div>
          <phone
            style="align-items: center; display: flex"
            class="ml-2"
          ></phone>
        </div>
        <v-divider class="mt-4 mb-8"></v-divider>
        <div class="list-item d-flex">
          <div>
            <h4 class="fontWeight mb-1">{{ $t("email_verify") }}</h4>
            <span class="text-gray--text font-weight-light">{{
              $t("protect_email")
            }}</span>
          </div>
          <v-spacer></v-spacer>
          <v-checkbox
            class="mr-12"
            style="align-items: center; display: flex"
            v-model="VerificationEmailCheckbox"
            :label="cutEmailValue(email)"
          ></v-checkbox>
          <div style="align-items: center; display: flex">
            <v-btn
              elevation="0"
              :style="customStyle"
              class="outlined-btn primary--text font-weight-bold text-none"
              >{{ $t("deleteText") }}</v-btn
            >
          </div>
          <email
            style="align-items: center; display: flex"
            class="ml-2"
          ></email>
        </div>
        <v-divider class="mt-4 mb-8"></v-divider>
        <h4 class="primary--text mb-6">{{ $t("advanced_security") }}</h4>
        <div class="list-item d-flex">
          <div>
            <h4 class="fontWeight mb-1">{{ $t("login_verify") }}</h4>
            <span class="text-gray--text font-weight-light">{{
              $t("protect_login")
            }}</span>
          </div>
          <v-spacer></v-spacer>
          <confirmPassword
            style="display: flex; align-items: center"
          ></confirmPassword>
        </div>
        <v-divider class="mt-4 mb-8"></v-divider>
        <h4 class="primary--text mb-6">{{ $t("devices_activities") }}</h4>
        <div class="list-item d-flex">
          <div>
            <h4 class="fontWeight mb-1">{{ $t("device_management") }}</h4>
            <span class="text-gray--text font-weight-light">{{
              $t("protect_devices")
            }}</span>
          </div>
          <v-spacer></v-spacer>

          <v-btn
            dark
            elevation="0"
            @click="
              $router.push({
                path: '/settings/devices',
              })
            "
            :style="customStyle"
            class="success-btn mt-4 font-weight-bold text-none"
            >{{ $t("manage") }}</v-btn
          >
        </div>
        <v-divider class="mt-4 mb-8"></v-divider>
        <div class="list-item d-flex">
          <div>
            <h4 class="fontWeight mb-1">{{ $t("Account Activity") }}</h4>
            <span class="text-gray--text font-weight-light"
              >{{ $t("last_logined") }} : 22.22.22</span
            >
          </div>
          <v-spacer></v-spacer>

          <v-btn
            dark
            elevation="0"
            @click="
              $router.push({
                path: '/settings/activity',
              })
            "
            :style="customStyle"
            class="success-btn mt-4 font-weight-bold text-none"
            >{{ $t("more") }}</v-btn
          >
        </div>
        <div class="mt-10 d-flex">
          <p class="text-gray--text font-weight-light">
            {{ $t("suspicious_activity") }}
          </p>
          <span class="primary--text ml-2">{{ $t("disable_account") }}</span>
        </div>
      </v-card>
    </div>
  </div>
</template>

<script>
import password from "../modals/security/Password";
import email from "../modals/security/Email";
import phone from "../modals/security/Phone";
import confirmPassword from "../modals/security/СonfirmPassword";
import config from "~/config/config.json";

export default {
  name: "privateInformation",
  components: {
    password,
    email,
    phone,
    confirmPassword,
  },
  props: {
    currentContent: {},
  },
  data() {
    return {
      primary: config.colors.text.primary,
      VerificationNumberCheckbox: true,
      VerificationEmailCheckbox: true,
      email: this.$auth.user.mail ? this.$auth.user.mail : "",
      phone: this.$auth.user.phone ? this.$auth.user.phone : "",
    };
  },
  methods: {
    contentHandler(val) {
      this.currentContent = val;
      this.$forceUpdate();
    },
    cutPhoneValue(val) {
      let string = "";
      if (val !== "") {
        return (string = `${val.slice(0, 4)}${"***"}${val.slice(8, -1)}`);
      } else {
        this.VerificationNumberCheckbox = false;
        return (string = "");
      }
      return string;
    },
    cutEmailValue(val) {
      let string = "";
      if (val !== "") {
        return (string = `${val.slice(0, 4)}${"***"}${val.slice(8, -1)}`);
      } else {
        this.VerificationEmailCheckbox = false;
        return (string = "");
      }
      return string;
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

<style scoped lang="scss">
.success-btn {
  background: var(--primary) !important;
  border: solid 2px var(--primary) !important;
  color: white !important;
  border-radius: 10px;
}
.outlined-btn {
  background: transparent !important;
  border: solid 2px var(--primary) !important;
  color: var(--primary);
  border-radius: 10px;
}
.fontWeight {
  font-weight: 600;
}
</style>
