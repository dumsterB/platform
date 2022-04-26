<template>
  <div class="py-10">
    <v-row>
      <v-col>
        <v-row>
          <v-spacer></v-spacer>
          <img
            style="
              height: 60px;
              margin-right: 20px;
            "
            :src="config.logo"
            :alt="$t('logoPic')"
          />
          <LangSelect style="max-width: 150px; margin-top: 10px" />
          <v-spacer></v-spacer>
        </v-row>
      </v-col>
    </v-row>
    <v-row class="authContainer">
      <v-col :md="12" :lg="5" class="text-center ">
        <div style="position: relative; top: 20%">

        </div>
      </v-col>
      <v-col :md="12" :lg="7" style="">
        <v-card
            v-if="!reg_log"
            elevation="8"
            class="px-4 py-6 pt-8 mx-auto rounded-lg cardBorder"
            :style="customStyle"
        >
          <v-row>
            <v-col cols="2">
              <p class="primary--text"> <v-btn icon > <v-icon class="primary--text">mdi-arrow-left</v-icon> </v-btn> Back</p>
            </v-col>
            <v-col>
              <h3>{{ $t("signin") }}</h3>
              <div v-if="steper == 0">
                <p class="d-flex text-gray--text">
                  {{ $t("readyToRegister") }}
                  <span
                      style="cursor: pointer"
                      class="ml-2 primary--text"
                      @click="$router.push('/registration')"
                  >{{ $t("signupHere") }}</span
                  >
                </p>
                <v-form
                    v-model="auth_login_form_valid"
                    ref="auth_login_form"
                    class="mt-6"
                    :lazy-validation="false"
                    @submit.prevent="auth_login">
                  <v-row>
                    <v-col>
                      <v-text-field
                          v-model="email"
                          :rules="validation.email"
                          dense
                          outlined
                          filled
                          class="fields"
                          :label="$t('email')"
                      ></v-text-field>

                    </v-col>
                    <v-col>
                      <v-text-field
                          v-model="password"
                          dense
                          outlined
                          :label="$t('password')"
                          filled
                          :append-icon="is_show_pass ? 'mdi-eye' : 'mdi-eye-off'"
                          :rules="validation.required"
                          :type="is_show_pass ? 'text' : 'password'"
                          @click:append="is_show_pass = !is_show_pass"
                      ></v-text-field>

                    </v-col>
                  </v-row>
                  <p v-if="error_message" style="color: red"></p>

                  <div class="d-flex">
                    <v-checkbox v-model="checkbox"></v-checkbox>
                    <span
                        style="font-size: 13px; margin-top: 22px"
                        class="text-gray--text"
                    >
                  {{ $t("remember_me") }}</span
                    >
                    <span
                        style="cursor: pointer"
                        class="ml-2 mt-5 primary--text"
                    >{{ $t("forgot_password") }}</span
                    >
                  </div>
                  <div class="">
                        <v-btn
                            width="250"
                            :loading="log_loader"
                            class="d-flex mt-2 mb-2 mx-auto"
                            color="primary"
                            type="submit"
                        >
                          {{ $t("signin") }}
                        </v-btn>
                  </div>
                </v-form>
              </div>
              <div>
                <div style="margin-top: 100px">
                  <h2>{{$t('fingertips')}}</h2>
                </div>
                <div>
                  <v-row class="mt-10" no-gutters>
                  <v-col>
                      <img src="@/static/img/AndroidApp.png" alt="">
                  </v-col>
                    <v-col>
                      <img src="@/static/img/Windows10Trader.png" alt="">
                    </v-col>
                    <v-col>
                    <img src="@/static/img/WebTrader.png" alt="">
                  </v-col>
                  </v-row>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar v-model="is_notify" color="#1F1F29" :timeout="3000" top="top">
      {{ is_notify_message }}
      <v-btn dark text @click="is_notify = false"> OK</v-btn>
    </v-snackbar>
    <registration></registration>
  </div>
</template>

<script>
import LangSelect from "~/components/settings/LanguageSelect";
import config from "~/config/config.json";
import { mapGetters } from "vuex";
import registration from '../registration/index'

export default {
  layout: "auth",
  components: {
    LangSelect,registration
  },
  watch: {},
  computed: {
    CURRENT_LOCALE() {
      return this.$i18n.locale;
    },
    ...mapGetters("data/countries", {
      countries: "list",
    }),
    validation() {
      return {
        required: [(v) => !!v || this.$t("password_required")],
        password: [
          (v) => !!v || this.$t("password_required"),
          (v) =>
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/.test(v) ||
            this.$t("password_create_description"),
        ],
        number: [
          (v) => (!!v && v.length == 12) || this.$t("invalid_phone_number"),
        ],
        name: [(v) => !!v || this.$t("enter_first_name")],
        surname: [(v) => !!v || this.$t("enter_last_name")],
        birth_place: [(v) => !!v || this.$t("enter_place_birth")],
        birth: [(v) => !!v || this.$t("enter_day_birth")],
        email: [
          (v) => !!v || this.$t("enter_verification_email"),
          (v) => /.+@.+\..+/.test(v) || this.$t("enter_verification_email"),
        ],
      };
    },
    customStyle() {
      return {
        "--border_color": this.border_color,
      };
    },
  },
  data() {
    return {
      config: config,
      border_color: config.colors.border,
      auth_login_form_valid: false,
      name: "",
      surname: "",
      phone_number: null,
      phone_str: "",
      selectCountry: null,
      selectGender: null,
      date: null,
      checkbox: false,
      email: "",
      password: "",
      password_confirm: "",
      // settings
      is_show_pass: false,
      is_show_pass_confirm: false,
      is_notify: false,
      is_notify_message: "",
      reg_log: false,
      steper: 0,
      error_message: null,
      reg_loader: false,
      log_loader: false,
      ident_passwords: [],
    };
  },

  methods: {
    async auth_login() {
      if (!this.$refs.auth_login_form.validate()) {
        return;
      }
      this.log_loader = true;
      await this.$auth
        .loginWith("local", {
          data: {
            mail: this.email,
            password: this.password,
          },
        })
        .then((response) => {
          this.log_loader = false;
          // console.log(response);
        })
        .catch((er) => {
          console.log(er);
          this.is_notify = true;
          this.is_notify_message = this.$t("AuthorisationError");
          this.log_loader = false;
        });
    },
    async reg_start() {
      if (!this.$refs.reg_form.validate()) {
        return;
      }
      this.phone_str = `+${this.phone_number}`;
      let res = await this.$axios.put("api/user/validate", {
        mail: this.email,
        phone: this.phone_str,
      });
      if (res.data.success) {
        this.steper = 1;
      } else {
        this.error_message = res.data.message;
        this.is_notify = true;
        this.is_notify_message = this.$t(this.error_message);
      }
    },
    async reg_end() {
      if (!this.$refs.reg_form_password.validate()) {
        return;
      }
      if (this.password != this.password_confirm) {
        this.ident_passwords = [this.$t("password_match")];
        return;
      }
      this.reg_loader = true;
      let res = await this.$axios.post("api/registerPlatform", {
        name: this.name,
        mail: this.email,
        password: this.password,
        domain: this.config.domain,
      });
      if (res.data.success) {
        setTimeout(async () => {
          await this.$auth
            .loginWith("local", {
              data: {
                mail: this.email,
                password: this.password,
              },
            })
            .then((response) => {
              // console.log(response);
              this.reg_loader = false;
            })
            .catch((er) => {
              console.log(er);
              this.is_notify = true;
              this.is_notify_message = this.$t("AuthorisationError");
              this.reg_loader = false;
            }, 500);
        });
      } else {
        this.error_message = res.data.message;
        this.is_notify = true;
        this.is_notify_message = this.$t(this.error_message);
      }
    },
  },
  created(){
    let htmlElement = document.documentElement;
    this.$vuetify.theme.dark = true;
    htmlElement.setAttribute("theme", 'dark')
  }
};
</script>
<style scoped>
.forgetPassword {
  text-align: center;
  display: flex;
  justify-content: center;
  cursor: pointer;
  margin-top: 15px;
}
.authContainer {
  display: flex;
  align-items: center;
}
.cardBorder {
  border: 1px solid var(--border_color);
  height: 100vh;
  background: #000C19;
}
.fields input{
  background: #161F49!important;
}
</style>
