<template>
  <div>
    <div class="privateInformation" v-if="currentContent===0">
      <p class="text-h6">{{ $t("security") }}</p>
      <v-card class="mainCard pa-5">
        <div class="list-item d-flex">
          <div>
            <h4 class="">{{ $t("security_keys") }}</h4>
            <span class="text-gray--text">{{ $t("protect_key") }}</span>
          </div>
          <v-spacer></v-spacer>
          <div style="align-items: center; display: flex">
            <v-btn
              dark
              elevation="0"
              :style="customStyle"
              class="success-btn"
              >{{ $t("enable") }}</v-btn
            >
          </div>
        </div>
        <v-divider class="mt-2 mb-2"></v-divider>
        <div class="list-item d-flex">
          <div>
            <h4>{{ $t("phone_num_verify") }}</h4>
            <span class="text-gray--text">{{ $t("protect_account") }}</span>
          </div>
          <v-spacer></v-spacer>
          <v-checkbox
            class="mr-2"
            style="align-items: center; display: flex"
            disabled
            v-model="VerificationNumberCheckbox"
            :label="$t('unset')"
          ></v-checkbox>
          <div style="align-items: center; display: flex">
            <v-btn
              elevation="0"
              :style="customStyle"
              class="outlined-btn primary--text"
              >{{ $t("deleteText") }}</v-btn
            >
          </div>
          <phone
            style="align-items: center; display: flex"
            class="ml-2"
          ></phone>
        </div>
        <v-divider class="mt-2 mb-2"></v-divider>
        <div class="list-item d-flex">
          <div>
            <h4>{{ $t("email_verify") }}</h4>
            <br />
            <span class="text-gray--text">{{ $t("protect_email") }}</span>
          </div>
          <v-spacer></v-spacer>
          <v-checkbox
            class="mr-2"
            disabled
            style="align-items: center; display: flex"
            v-model="VerificationNumberCheckbox"
            :label="$t('unset')"
          ></v-checkbox>
          <div style="align-items: center; display: flex">
            <v-btn
              elevation="0"
              :style="customStyle"
              class="outlined-btn primary--text"
              >{{ $t("deleteText") }}</v-btn
            >
          </div>
          <email
            style="align-items: center; display: flex"
            class="ml-2"
          ></email>
        </div>
        <br />
        <v-divider class="mt-2 mb-2"></v-divider>
        <h4 class="primary--text">{{ $t("advanced_security") }}</h4>
        <br>
        <div class="list-item d-flex">
          <div>
            <h4>{{ $t("login_verify") }}</h4>
            <br />
            <span class="text-gray--text">{{ $t("protect_login") }}</span>
          </div>
          <v-spacer></v-spacer>
          <v-checkbox
            class="mr-2"
            disabled
            style="align-items: center; display: flex"
            v-model="VerificationNumberCheckbox"
            :label="$t('unset')"
          ></v-checkbox>
          <confirmPassword
            style="display: flex; align-items: center"
          ></confirmPassword>
        </div>
        <h4 class="primary--text">{{ $t("devices_activities") }}</h4>
        <br>
        <div class="list-item d-flex">
          <div>
            <h4>{{ $t("device_management") }}</h4>
            <br />
            <span class="text-gray--text">{{ $t("protect_devices") }}</span>
          </div>
          <v-spacer></v-spacer>
          <v-checkbox
              class="mr-2"
              disabled
              style="align-items: center; display: flex"
              v-model="VerificationNumberCheckbox"
              :label="$t('unset')"
          ></v-checkbox>
          <v-btn dark elevation="0"  @click="$emit('change_content',1)" :style="customStyle" class="success-btn mt-4">{{
              $t("manage")
            }}</v-btn>
        </div>
        <v-divider class="mt-2 mb-2"></v-divider>
        <div class="list-item d-flex">
          <div>
            <h4>{{ $t("Account Activity") }}</h4>
            <br />
            <span class="text-gray--text">{{ $t("last_logined") }} : 22.22.22</span>
          </div>
          <v-spacer></v-spacer>
          <v-checkbox
              class="mr-2"
              disabled
              style="align-items: center; display: flex"
              v-model="VerificationNumberCheckbox"
              :label="$t('unset')"
          ></v-checkbox>
          <v-btn dark elevation="0" @click="$emit('change_content',2)"  :style="customStyle" class="success-btn mt-4">{{
              $t("more")
            }}</v-btn>
        </div>
        <div class="mt-15 d-flex">
          <p>{{$t('suspicious_activity')}}</p> <span class="primary--text">{{$t('disable_account')}}</span>
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
  props:{
    currentContent:{}
  },
  data() {
    return {
      btn_bg: config.colors.text.btn_bg,
      start_gradient: config.themes.dark.start_gradient,
      end_gradient: config.themes.dark.end_gradient,
      VerificationNumberCheckbox: false,
    };
  },
  methods: {
    contentHandler(val){
      this.currentContent=val
      this.$forceUpdate()
    }
  },
  computed: {
    customStyle() {
      return {
        "--btn_bg": this.btn_bg,
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
.outlined-btn {
  background-origin: border-box;
  background-clip: padding-box, border-box;
  border: solid 2px transparent;
  color: primary;
  background-image: linear-gradient(var(--btn_bg), var(--btn_bg)),
    linear-gradient(
      94.9deg,
      var(--start_gradient) 4.26%,
      var(--end_gradient) 95.87%
    );
}
</style>
