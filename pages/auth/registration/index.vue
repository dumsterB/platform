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
              <h3>{{ $t("createAccount") }}</h3>
              <div v-if="steper == 0">
                <p class="d-flex text-gray--text">
                  {{ $t("readyToRegister") }}
                  <span
                      style="cursor: pointer"
                      class="ml-2 primary--text"
                      @click="$router.push('/registration')"
                  >{{ $t("signinHere") }}</span
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
                          v-model="name"
                          :rules="validation.required"
                          dense
                          outlined
                          filled
                          class="fields"
                          :label="$t('first_name')"
                      ></v-text-field>

                    </v-col>
                    <v-col>
                      <v-text-field
                          v-model="surname"
                          dense
                          outlined
                          :label="$t('surname')"
                          filled
                          :rules="validation.required"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                          v-model="email"
                          dense
                          outlined
                          :label="$t('email')"
                          filled
                          :rules="validation.email"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="2">
                      <v-autocomplete outlined dense filled item-text="total" item-value="total" :items="filteredNumbers"></v-autocomplete>
                    </v-col>
                    <v-col cols="10">
                      <v-text-field
                          v-model="phone"
                          dense
                          outlined
                          :label="$t('phone_number')"
                          filled
                          :rules="validation.phone_number"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <p v-if="error_message" style="color: red"></p>
                  <div class="">
                    <v-col>
                      <v-timeline
                          dense
                          clipped
                      >
                        <v-timeline-item
                            fill-dot
                            class="white--text mb-12"
                            color="orange"
                            large
                        >
                          </v-timeline-item>
                      </v-timeline>
                    </v-col>
                    <v-col>

                    </v-col>
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
  </div>
</template>

<script>
import LangSelect from "~/components/settings/LanguageSelect";
import config from "~/config/config.json";
import { mapGetters } from "vuex";

export default {
  layout: "auth",
  components: {
    LangSelect,
  },
  watch: {},
  computed: {
    filteredNumbers(){
      return this.countries_code.map((item) => {
        return {total:`+${item.value}`}
      })
    },
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
      countries_code:
        [{country: "United Kingdom", value: 44},
        {country: "United States", value: 1},
        {country: "Algeria", value: 213},
        {country: "Andorra", value: 376},
        {country: "Angola", value: 244},
        {country: "Anguilla", value: 1264},
        {country: "Antigua & Barbuda", value: 1268},
        {country: "Argentina", value: 54},
        {country: "Armenia", value: 374},
        {country: "Aruba", value: 297},
        {country: "Australia", value: 61},
        {country: "Austria", value: 43},
        {country: "Azerbaijan", value: 994},
        {country: "Bahamas", value: 1242},
        {country: "Bahrain", value: 973},
        {country: "Bangladesh", value: 880},
        {country: "Barbados", value: 1246},
        {country: "Belarus", value: 375},
        {country: "Belgium", value: 32},
        {country: "Belize", value: 501},
        {country: "Benin", value: 229},
        {country: "Bermuda", value: 1441},
        {country: "Bhutan", value: 975},
        {country: "Bolivia", value: 591},
        {country: "Bosnia Herzegovina", value: 387},
        {country: "Botswana", value: 267},
        {country: "Brazil", value: 55},
        {country: "Brunei", value: 673},
        {country: "Bulgaria", value: 359},
        {country: "Burkina Faso", value: 226},
        {country: "Burundi", value: 257},
        {country: "Cambodia", value: 855},
        {country: "Cameroon", value: 237},
        {country: "Canada", value: 1},
        {country: "Cape Verde Islands", value: 238},
        {country: "Cayman Islands", value: 1345},
        {country: "Central African Republic", value: 236},
        {country: "Chile", value: 56},
        {country: "China", value: 86},
        {country: "Colombia", value: 57},
        {country: "Comoros", value: 269},
        {country: "Congo", value: 242},
        {country: "Cook Islands", value: 682},
        {country: "Costa Rica", value: 506},
        {country: "Croatia", value: 385},
        {country: "Cuba", value: 53},
        {country: "Cyprus North", value: 90392},
        {country: "Cyprus South", value: 357},
        {country: "Czech Republic", value: 42},
        {country: "Denmark", value: 45},
        {country: "Djibouti", value: 253},
        {country: "Dominica", value: 1809},
        {country: "Dominican Republic", value: 1809},
        {country: "Ecuador", value: 593},
        {country: "Egypt", value: 20},
        {country: "El Salvador", value: 503},
        {country: "Equatorial Guinea", value: 240},
        {country: "Eritrea", value: 291},
        {country: "Estonia", value: 372},
        {country: "Ethiopia", value: 251},
        {country: "Falkland Islands", value: 500},
        {country: "Faroe Islands", value: 298},
        {country: "Fiji", value: 679},
        {country: "Finland", value: 358},
        {country: "France", value: 33},
        {country: "French Guiana", value: 594},
        {country: "French Polynesia", value: 689},
        {country: "Gabon", value: 241},
        {country: "Gambia", value: 220},
        {country: "Georgia", value: 7880},
        {country: "Germany", value: 49},
        {country: "Ghana", value: 233},
        {country: "Gibraltar", value: 350},
        {country: "Greece", value: 30},
        {country: "Greenland", value: 299},
        {country: "Grenada", value: 1473},
        {country: "Guadeloupe", value: 590},
        {country: "Guam", value: 671},
        {country: "Guatemala", value: 502},
        {country: "Guinea", value: 224},
        {country: "Guinea - Bissau", value: 245},
        {country: "Guyana", value: 592},
        {country: "Haiti", value: 509},
        {country: "Honduras", value: 504},
        {country: "Hong Kong", value: 852},
        {country: "Hungary", value: 36},
        {country: "Iceland", value: 354},
        {country: "India", value: 91},
        {country: "Indonesia", value: 62},
        {country: "Iran", value: 98},
        {country: "Iraq", value: 964},
        {country: "Ireland", value: 353},
        {country: "Israel", value: 972},
        {country: "Italy", value: 39},
        {country: "Jamaica", value: 1876},
        {country: "Japan", value: 81},
        {country: "Jordan", value: 962},
        {country: "Kazakhstan", value: 7},
        {country: "Kenya", value: 254},
        {country: "Kiribati", value: 686},
        {country: "Korea North", value: 850},
        {country: "Korea South", value: 82},
        {country: "Kuwait", value: 965},
        {country: "Kyrgyzstan", value: 996},
        {country: "Laos", value: 856},
        {country: "Latvia", value: 371},
        {country: "Lebanon", value: 961},
        {country: "Lesotho", value: 266},
        {country: "Liberia", value: 231},
        {country: "Libya", value: 218},
        {country: "Liechtenstein", value: 417},
        {country: "Lithuania", value: 370},
        {country: "Luxembourg", value: 352},
        {country: "Macao", value: 853},
        {country: "Macedonia", value: 389},
        {country: "Madagascar", value: 261},
        {country: "Malawi", value: 265},
        {country: "Malaysia", value: 60},
        {country: "Maldives", value: 960},
        {country: "Mali", value: 223},
        {country: "Malta", value: 356},
        {country: "Marshall Islands", value: 692},
        {country: "Martinique", value: 596},
        {country: "Mauritania", value: 222},
        {country: "Mauritius ", value: 230},
        {country: "Mayotte", value: 269},
        {country: "Mexico", value: 52},
        {country: "Micronesia", value: 691},
        {country: "Moldova", value: 373},
        {country: "Monaco", value: 377},
        {country: "Mongolia", value: 976},
        {country: "Montserrat", value: 1664},
        {country: "Morocco", value: 212},
        {country: "Mozambique", value: 258},
        {country: "Myanmar", value: 95},
        {country: "Namibia", value: 264},
        {country: "Nauru", value: 674},
        {country: "Nepal", value: 977},
        {country: "Netherlands", value: 31},
        {country: "New Caledonia", value: 687},
        {country: "New Zealand", value: 64},
        {country: "Nicaragua", value: 505},
        {country: "Niger", value: 227},
        {country: "Nigeria", value: 234},
        {country: "Niue", value: 683},
        {country: "Norfolk Islands", value: 672},
        {country: "Northern Marianas", value: 670},
        {country: "Norway", value: 47},
        {country: "Oman", value: 968},
        {country: "Palau", value: 680},
        {country: "Panama", value: 507},
        {country: "Papua New Guinea", value: 675},
        {country: "Paraguay", value: 595},
        {country: "Peru", value: 51},
        {country: "Philippines", value: 63},
        {country: "Poland", value: 48},
        {country: "Portugal", value: 351},
        {country: "Puerto Rico", value: 1787},
        {country: "Qatar", value: 974},
        {country: "Reunion", value: 262},
        {country: "Romania", value: 40},
        {country: "Russia", value: 7},
        {country: "Rwanda", value: 250},
        {country: "San Marino", value: 378},
        {country: "Sao Tome & Principe", value: 239},
        {country: "Saudi Arabia", value: 966},
        {country: "Senegal", value: 221},
        {country: "Serbia", value: 381},
        {country: "Seychelles", value: 248},
        {country: "Sierra Leone", value: 232},
        {country: "Singapore", value: 65},
        {country: "Slovak Republic", value: 421},
        {country: "Slovenia", value: 386},
        {country: "Solomon Islands", value: 677},
        {country: "Somalia", value: 252},
        {country: "South Africa", value: 27},
        {country: "Spain", value: 34},
        {country: "Sri Lanka", value: 94},
        {country: "St. Helena", value: 290},
        {country: "St. Kitts", value: 1869},
        {country: "St. Lucia", value: 1758},
        {country: "Sudan", value: 249},
        {country: "Suriname", value: 597},
        {country: "Swaziland", value: 268},
        {country: "Sweden", value: 46},
        {country: "Switzerland", value: 41},
        {country: "Syria", value: 963},
        {country: "Taiwan", value: 886},
        {country: "Tajikstan", value: 7},
        {country: "Thailand", value: 66},
        {country: "Togo", value: 228},
        {country: "Tonga", value: 676},
        {country: "Trinidad & Tobago", value: 1868},
        {country: "Tunisia", value: 216},
        {country: "Turkey", value: 90},
        {country: "Turkmenistan", value: 7},
        {country: "Turkmenistan", value: 993},
        {country: "Turks & Caicos Islands", value: 1649},
        {country: "Tuvalu", value: 688},
        {country: "Uganda", value: 256},
        {country: "Ukraine", value: 380},
        {country: "United Arab Emirates", value: 971},
        {country: "Uruguay", value: 598},
        {country: "Uzbekistan", value: 998},
        {country: "Vanuatu", value: 678},
        {country: "Vatican City", value: 379},
        {country: "Venezuela", value: 58},
        {country: "Vietnam", value: 84},
        {country: "Virgin Islands - British", value: 1284},
        {country: "Virgin Islands - US", value: 1340},
        {country: "Wallis & Futuna", value: 681},
        {country: "Yemen North", value: 969},
        {country: "Yemen South", value: 967},
        {country: "Zambia", value: 260},
        {country: "Zimbabwe", value: 263},],
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
