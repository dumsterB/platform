<template>
  <div class="py-10">
    <v-row>
      <v-col>
        <v-row>
          <v-spacer></v-spacer>
          <img
            style="height: 60px; margin-right: 20px"
            :src="config.logo"
            alt="Профинвест картинка"
          />
          <LangSelect style="max-width: 150px; margin-top: 10px" />
          <v-spacer></v-spacer>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col :md="12" :lg="6" style="">
        <v-card
          v-if="!reg_log"
          elevation="4"
          max-width="450"
          class="px-4 py-6 pt-8 mx-auto"
        >
          <h3>{{ $t("register") }}</h3>
          <div v-if="steper == 0">
            <p class="d-flex">
              {{ $t("readyToRegister") }}
              <span
                style="cursor: pointer; color: green"
                class="ml-2"
                @click="reg_log = true"
                >{{ $t("signinHere") }}</span
              >
            </p>
            <v-form ref="reg_form" class="mt-6" :lazy-validation="false">
              <v-text-field
                v-model="name"
                :rules="validation.name"
                dense
                outlined
                :label="$t('first_name')"
              ></v-text-field>
              <v-text-field
                v-model="email"
                :rules="validation.email"
                dense
                outlined
                :label="$t('email')"
                required
              ></v-text-field>
              <!-- <v-text-field
                v-model="phone_number"
                :rules="validation.number"
                dense
                outlined
                type="number"
                :label="$t('phone_number')"
              ></v-text-field> -->
              <!-- <v-autocomplete
                v-model="selectCountry"
                :items="countries"
                :rules="validation.birth_place"
                :label="$t('place_of_birth')"
                outlined
                dense
              ></v-autocomplete> -->
              <!-- <v-text-field
                v-model="date"
                :label="$t('date_of_birth')"
                outlined
                :rules="validation.birth"
                dense
                type="date"
              ></v-text-field> -->

              <p v-if="error_message" style="color: red"></p>

              <div class="d-flex">
                <v-checkbox v-model="checkbox"></v-checkbox>
                <span
                  style="font-size: 13px; margin-top: 22px"
                  class="text-gray"
                >
                  {{ $t("agree_with_policy") }}</span
                >
              </div>
              <p style="font-size: 14px">
                {{ $t("agree")
                }}<span style="cursor: pointer; color: green">
                  {{ $t("terms_and_policy") }}
                </span>
              </p>

              <div>
                <v-btn
                  width="200"
                  outlined
                  tile
                  class="d-flex mt-2 mb-2 mx-auto"
                  color="green"
                  @click="reg_start"
                >
                  {{ $t("to_continue") }}
                </v-btn>
              </div>
            </v-form>
          </div>
          <div v-if="steper == 1">
            <p class="d-flex">
              {{ $t("create_password") }}
            </p>
            <v-form
              ref="reg_form_password"
              class="mt-6"
              :lazy-validation="false"
            >
              <v-text-field
                v-model="email"
                disabled
                dense
                outlined
                :label="$t('email')"
              ></v-text-field>

              <v-text-field
                v-model="password"
                dense
                outlined
                :label="$t('password')"
                :append-icon="is_show_pass ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="validation.password"
                :type="is_show_pass ? 'text' : 'password'"
                @click:append="is_show_pass = !is_show_pass"
              ></v-text-field>

              <v-text-field
                v-model="password_confirm"
                dense
                outlined
                :label="$t('confirm_password')"
                :append-icon="is_show_pass_confirm ? 'mdi-eye' : 'mdi-eye-off'"
                :error-messages="ident_passwords"
                :type="is_show_pass_confirm ? 'text' : 'password'"
                @click:append="is_show_pass_confirm = !is_show_pass_confirm"
              ></v-text-field>

              <div>
                <v-btn
                  width="200"
                  outlined
                  tile
                  class="d-flex mt-2 mb-2 mx-auto"
                  color="green"
                  :loading="reg_loader"
                  @click="reg_end"
                >
                  {{ $t("to_continue") }}
                </v-btn>
              </div>
            </v-form>
          </div>
        </v-card>
        <v-card
          v-if="reg_log"
          max-width="450"
          elevation="4"
          class="px-4 py-6 pt-8 mx-auto"
        >
          <h3>{{ $t("signin") }}</h3>
          <p class="d-flex">
            {{ $t("haveNotAccount") }}
            <span
              style="cursor: pointer; color: green"
              class="ml-2"
              @click="reg_log = false"
              >{{ $t("signupHere") }}</span
            >
          </p>
          <v-form
            v-model="auth_login_form_valid"
            ref="auth_login_form"
            class="mt-6"
            :lazy-validation="false"
            @submit.prevent="auth_login"
          >
            <v-text-field
              v-model="email"
              :rules="validation.email"
              dense
              outlined
              :label="$t('email')"
            ></v-text-field>

            <v-text-field
              v-model="password"
              dense
              outlined
              :label="$t('password')"
              :append-icon="is_show_pass ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="validation.required"
              :type="is_show_pass ? 'text' : 'password'"
              @click:append="is_show_pass = !is_show_pass"
            ></v-text-field>

            <div>
              <v-btn
                width="200"
                outlined
                tile
                :loading="log_loader"
                class="d-flex mt-2 mb-2 mx-auto"
                color="green"
                type="submit"
              >
                {{ $t("signin") }}
              </v-btn>
              <span class="forgetPassword">
                {{ $t("forgetPasswordMessage") }}</span
              >
            </div>
          </v-form>
        </v-card>
      </v-col>
      <v-col :md="12" :lg="6" class="text-center">
        <div style="position: relative; top: 20%">
          <SvgImage />
        </div>
      </v-col>
    </v-row>
    <v-snackbar v-model="is_notify" color="#1F1F29" :timeout="3000" top="top">
      {{ is_notify_message }}
      <v-btn dark text @click="is_notify = false"> OK</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import SvgImage from "./svg.vue";
import LangSelect from "~/components/settings/LanguageSelect";
import config from "~/config/config.json";

export default {
  layout: "auth",
  components: {
    SvgImage,
    LangSelect,
  },
  watch: {
    CURRENT_LOCALE(v) {
      this.validation = {
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
        birth_place: [(v) => !!v || this.$t("enter_place_birth")],
        birth: [(v) => !!v || this.$t("enter_day_birth")],
        email: [
          (v) => !!v || this.$t("enter_verification_email"),
          (v) => /.+@.+\..+/.test(v) || this.$t("enter_verification_email"),
        ],
      };
    },
  },
  computed: {
    CURRENT_LOCALE() {
      return this.$i18n.locale;
    },
  },
  data() {
    return {
      config: config,
      countries: this.$store.state.config.data.countries,
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

      // data validation
      validation: {
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
      },
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

  mounted() {},
};
</script>
<style scoped>
.forgetPassword {
  color: #23ad41;
  text-align: center;
  display: flex;
  justify-content: center;
  cursor: pointer;
  margin-top: 15px;
}
</style>
