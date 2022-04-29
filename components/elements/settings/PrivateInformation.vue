<template>
  <div class="privateInformation">
    <p class="text-h6">{{ $t("personal_information") }}</p>
    <v-card class="mainCard pt-6">
      <div class="text-center">
        <div class="selecImage">
          <div
            class="image-input"
            :style="`background-image: url(${
              imageData ? imageData : image_data
            }); background-size: 200px;`"
            @click="chooseImage"
          >
            <span v-if="!imageData" class="placeholder text-gray--text">
              <v-icon color="#000C19" size="50">mdi-camera</v-icon>
            </span>
            <input
              class="file-input"
              ref="fileInput"
              type="file"
              @input="onSelectFile"
            />
          </div>
        </div>
        <p>{{ $t("choose_photo") }}</p>
      </div>
      <div class="form">
        <v-container>
          <v-row>
            <v-col cols="12" md="6" sm="6" lg="6">
              <v-text-field
                v-model="name"
                outlined
                filled
                dense
                :label="$t('first_name')"
                :rules="validation.name"
                required
              ></v-text-field>

              <v-text-field
                v-model="email"
                :rules="validation.email"
                :label="$t('email')"
                readonly
                required
                outlined
                filled
                dense
              ></v-text-field>

              <v-autocomplete
                v-model="selectCountry"
                :items="countries"
                :rules="validation.birth_place"
                :label="$t('place_of_birth')"
                item-text="country"
                item-value="id"
                outlined
                filled
                dense
                required
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" md="6" sm="6" lg="6">
              <v-text-field
                v-model="surname"
                outlined
                filled
                dense
                :label="$t('surname')"
                :rules="validation.surname"
                required
              ></v-text-field>
              <v-text-field
                v-model="phone"
                outlined
                filled
                dense
                :label="$t('phone_number')"
                :rules="validation.number"
                required
              ></v-text-field>
              <v-text-field
                v-model="date"
                :label="$t('date_of_birth')"
                :rules="validation.birth"
                outlined
                dense
                type="date"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-row>
                <!-- <v-col cols="4">
              <v-autocomplete outlined dense :value="filteredNumbers[0]" filled item-text="total" item-value="total" :items="filteredNumbers"></v-autocomplete>
            </v-col> -->
                <!-- <v-col cols="8">
              <v-text-field
                  v-model="phone"
                  dense
                  outlined
                  :label="$t('phone_number')"
                  filled
                  :rules="validation.phone_number"
              ></v-text-field>
            </v-col> -->
              </v-row>
            </v-col>
          </v-row>
        </v-container>
        <v-card-actions class="text-center d-flex justify-center">
          <v-btn
            class="mr-4 success-btn ml-2 mb-4"
            :style="customStyle"
            @click="validate"
            elevation="0"
            rounded
            width="300"
            large
            dark
            :loading="loading"
          >
            {{ loading ? "" : $t("saveAccountSettings") }}
          </v-btn>
        </v-card-actions>
      </div>
    </v-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import config from "~/config/config.json";
export default {
  name: "privateInformation",
  data() {
    return {
      primary: config.colors.text.primary,
      rules: [
        (value) =>
          !value ||
          value.size < 2000000 ||
          "Avatar size should be less than 2 MB!",
      ],
      gender: ["male", "female"],
      imageData: null,
      selectCountry: this.$auth.user.country_id,
      name: this.$auth.user.name,
      surname: this.$auth.user.last_name,
      email: this.$auth.user.mail,
      date: this.$auth.user.birth,
      menu: false,
      phone: this.$auth.user.phone,
      loading: false,
      image_data: null,
      formData: null,
      countries_code: [
        { country: "United Kingdom", value: 44 },
        { country: "United States", value: 1 },
        { country: "Algeria", value: 213 },
        { country: "Andorra", value: 376 },
        { country: "Angola", value: 244 },
        { country: "Anguilla", value: 1264 },
        { country: "Antigua & Barbuda", value: 1268 },
        { country: "Argentina", value: 54 },
        { country: "Armenia", value: 374 },
        { country: "Aruba", value: 297 },
        { country: "Australia", value: 61 },
        { country: "Austria", value: 43 },
        { country: "Azerbaijan", value: 994 },
        { country: "Bahamas", value: 1242 },
        { country: "Bahrain", value: 973 },
        { country: "Bangladesh", value: 880 },
        { country: "Barbados", value: 1246 },
        { country: "Belarus", value: 375 },
        { country: "Belgium", value: 32 },
        { country: "Belize", value: 501 },
        { country: "Benin", value: 229 },
        { country: "Bermuda", value: 1441 },
        { country: "Bhutan", value: 975 },
        { country: "Bolivia", value: 591 },
        { country: "Bosnia Herzegovina", value: 387 },
        { country: "Botswana", value: 267 },
        { country: "Brazil", value: 55 },
        { country: "Brunei", value: 673 },
        { country: "Bulgaria", value: 359 },
        { country: "Burkina Faso", value: 226 },
        { country: "Burundi", value: 257 },
        { country: "Cambodia", value: 855 },
        { country: "Cameroon", value: 237 },
        { country: "Canada", value: 1 },
        { country: "Cape Verde Islands", value: 238 },
        { country: "Cayman Islands", value: 1345 },
        { country: "Central African Republic", value: 236 },
        { country: "Chile", value: 56 },
        { country: "China", value: 86 },
        { country: "Colombia", value: 57 },
        { country: "Comoros", value: 269 },
        { country: "Congo", value: 242 },
        { country: "Cook Islands", value: 682 },
        { country: "Costa Rica", value: 506 },
        { country: "Croatia", value: 385 },
        { country: "Cuba", value: 53 },
        { country: "Cyprus North", value: 90392 },
        { country: "Cyprus South", value: 357 },
        { country: "Czech Republic", value: 42 },
        { country: "Denmark", value: 45 },
        { country: "Djibouti", value: 253 },
        { country: "Dominica", value: 1809 },
        { country: "Dominican Republic", value: 1809 },
        { country: "Ecuador", value: 593 },
        { country: "Egypt", value: 20 },
        { country: "El Salvador", value: 503 },
        { country: "Equatorial Guinea", value: 240 },
        { country: "Eritrea", value: 291 },
        { country: "Estonia", value: 372 },
        { country: "Ethiopia", value: 251 },
        { country: "Falkland Islands", value: 500 },
        { country: "Faroe Islands", value: 298 },
        { country: "Fiji", value: 679 },
        { country: "Finland", value: 358 },
        { country: "France", value: 33 },
        { country: "French Guiana", value: 594 },
        { country: "French Polynesia", value: 689 },
        { country: "Gabon", value: 241 },
        { country: "Gambia", value: 220 },
        { country: "Georgia", value: 7880 },
        { country: "Germany", value: 49 },
        { country: "Ghana", value: 233 },
        { country: "Gibraltar", value: 350 },
        { country: "Greece", value: 30 },
        { country: "Greenland", value: 299 },
        { country: "Grenada", value: 1473 },
        { country: "Guadeloupe", value: 590 },
        { country: "Guam", value: 671 },
        { country: "Guatemala", value: 502 },
        { country: "Guinea", value: 224 },
        { country: "Guinea - Bissau", value: 245 },
        { country: "Guyana", value: 592 },
        { country: "Haiti", value: 509 },
        { country: "Honduras", value: 504 },
        { country: "Hong Kong", value: 852 },
        { country: "Hungary", value: 36 },
        { country: "Iceland", value: 354 },
        { country: "India", value: 91 },
        { country: "Indonesia", value: 62 },
        { country: "Iran", value: 98 },
        { country: "Iraq", value: 964 },
        { country: "Ireland", value: 353 },
        { country: "Israel", value: 972 },
        { country: "Italy", value: 39 },
        { country: "Jamaica", value: 1876 },
        { country: "Japan", value: 81 },
        { country: "Jordan", value: 962 },
        { country: "Kazakhstan", value: 7 },
        { country: "Kenya", value: 254 },
        { country: "Kiribati", value: 686 },
        { country: "Korea North", value: 850 },
        { country: "Korea South", value: 82 },
        { country: "Kuwait", value: 965 },
        { country: "Kyrgyzstan", value: 996 },
        { country: "Laos", value: 856 },
        { country: "Latvia", value: 371 },
        { country: "Lebanon", value: 961 },
        { country: "Lesotho", value: 266 },
        { country: "Liberia", value: 231 },
        { country: "Libya", value: 218 },
        { country: "Liechtenstein", value: 417 },
        { country: "Lithuania", value: 370 },
        { country: "Luxembourg", value: 352 },
        { country: "Macao", value: 853 },
        { country: "Macedonia", value: 389 },
        { country: "Madagascar", value: 261 },
        { country: "Malawi", value: 265 },
        { country: "Malaysia", value: 60 },
        { country: "Maldives", value: 960 },
        { country: "Mali", value: 223 },
        { country: "Malta", value: 356 },
        { country: "Marshall Islands", value: 692 },
        { country: "Martinique", value: 596 },
        { country: "Mauritania", value: 222 },
        { country: "Mauritius ", value: 230 },
        { country: "Mayotte", value: 269 },
        { country: "Mexico", value: 52 },
        { country: "Micronesia", value: 691 },
        { country: "Moldova", value: 373 },
        { country: "Monaco", value: 377 },
        { country: "Mongolia", value: 976 },
        { country: "Montserrat", value: 1664 },
        { country: "Morocco", value: 212 },
        { country: "Mozambique", value: 258 },
        { country: "Myanmar", value: 95 },
        { country: "Namibia", value: 264 },
        { country: "Nauru", value: 674 },
        { country: "Nepal", value: 977 },
        { country: "Netherlands", value: 31 },
        { country: "New Caledonia", value: 687 },
        { country: "New Zealand", value: 64 },
        { country: "Nicaragua", value: 505 },
        { country: "Niger", value: 227 },
        { country: "Nigeria", value: 234 },
        { country: "Niue", value: 683 },
        { country: "Norfolk Islands", value: 672 },
        { country: "Northern Marianas", value: 670 },
        { country: "Norway", value: 47 },
        { country: "Oman", value: 968 },
        { country: "Palau", value: 680 },
        { country: "Panama", value: 507 },
        { country: "Papua New Guinea", value: 675 },
        { country: "Paraguay", value: 595 },
        { country: "Peru", value: 51 },
        { country: "Philippines", value: 63 },
        { country: "Poland", value: 48 },
        { country: "Portugal", value: 351 },
        { country: "Puerto Rico", value: 1787 },
        { country: "Qatar", value: 974 },
        { country: "Reunion", value: 262 },
        { country: "Romania", value: 40 },
        { country: "Russia", value: 7 },
        { country: "Rwanda", value: 250 },
        { country: "San Marino", value: 378 },
        { country: "Sao Tome & Principe", value: 239 },
        { country: "Saudi Arabia", value: 966 },
        { country: "Senegal", value: 221 },
        { country: "Serbia", value: 381 },
        { country: "Seychelles", value: 248 },
        { country: "Sierra Leone", value: 232 },
        { country: "Singapore", value: 65 },
        { country: "Slovak Republic", value: 421 },
        { country: "Slovenia", value: 386 },
        { country: "Solomon Islands", value: 677 },
        { country: "Somalia", value: 252 },
        { country: "South Africa", value: 27 },
        { country: "Spain", value: 34 },
        { country: "Sri Lanka", value: 94 },
        { country: "St. Helena", value: 290 },
        { country: "St. Kitts", value: 1869 },
        { country: "St. Lucia", value: 1758 },
        { country: "Sudan", value: 249 },
        { country: "Suriname", value: 597 },
        { country: "Swaziland", value: 268 },
        { country: "Sweden", value: 46 },
        { country: "Switzerland", value: 41 },
        { country: "Syria", value: 963 },
        { country: "Taiwan", value: 886 },
        { country: "Tajikstan", value: 7 },
        { country: "Thailand", value: 66 },
        { country: "Togo", value: 228 },
        { country: "Tonga", value: 676 },
        { country: "Trinidad & Tobago", value: 1868 },
        { country: "Tunisia", value: 216 },
        { country: "Turkey", value: 90 },
        { country: "Turkmenistan", value: 7 },
        { country: "Turkmenistan", value: 993 },
        { country: "Turks & Caicos Islands", value: 1649 },
        { country: "Tuvalu", value: 688 },
        { country: "Uganda", value: 256 },
        { country: "Ukraine", value: 380 },
        { country: "United Arab Emirates", value: 971 },
        { country: "Uruguay", value: 598 },
        { country: "Uzbekistan", value: 998 },
        { country: "Vanuatu", value: 678 },
        { country: "Vatican City", value: 379 },
        { country: "Venezuela", value: 58 },
        { country: "Vietnam", value: 84 },
        { country: "Virgin Islands - British", value: 1284 },
        { country: "Virgin Islands - US", value: 1340 },
        { country: "Wallis & Futuna", value: 681 },
        { country: "Yemen North", value: 969 },
        { country: "Yemen South", value: 967 },
        { country: "Zambia", value: 260 },
        { country: "Zimbabwe", value: 263 },
      ],
    };
  },
  methods: {
    chooseImage() {
      this.$refs.fileInput.click();
    },
    onSelectFile() {
      const input = this.$refs.fileInput;
      const files = input.files;
      if (files && files[0]) {
        this.formData = new FormData();
        this.formData.append("file", files[0]);
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imageData = e.target.result;
        };
        reader.readAsDataURL(files[0]);
      }
    },
    async validate() {
      this.loading = true;
      let user_data = {};
      user_data.id = this.$auth.user.id;
      user_data.mail = this.$auth.user.mail;
      user_data.name = this.name;
      user_data.last_name = this.surname;
      user_data.birth = this.date;
      user_data.phone = this.phone;
      user_data.country_id = this.selectCountry;
      if (this.formData) {
        let rs1 = await this.$axios
          .post(
            `/api/platform/user_platform/${this.$auth.user.id}/img`,
            this.formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          )
          .then((rsp) => {
            console.log("FILE SAVE RESP", rsp);
          })
          .catch(function (e) {
            console.log("== == !! UPLOAD FAIL", e);
            return;
          });
      }

      let rs = await this.$axios.put(
        `/api/platform/user_platform/${user_data.id}`,
        user_data,
        {}
      );
      this.$auth.setUser(rs.data.data);
      console.log("rs", rs);
      setTimeout(() => {
        this.loading = false;
      }, 500);
    },
  },
  mounted() {
    console.log("user_data", this.$auth.user);
    if (this.$auth.user.fs && this.$auth.user.fs.length > 0) {
      this.image_data =
        this.$env("FILE_SERVER_BASE") + this.$auth.user.fs[0].dir;
      console.log(this.image_data);
    }
  },
  computed: {
    ...mapGetters("data/countries", {
      countries: "list",
    }),
    filteredNumbers() {
      return this.countries_code.map((item) => {
        return { total: `+${item.value}` };
      });
    },
    customStyle() {
      return {
        "--primary": this.primary,
      };
    },

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
    disableBtn() {
      return (
        this.name &&
        this.surname &&
        this.selectCountry &&
        this.selectGender &&
        this.phone &&
        this.email &&
        this.date
      );
    },
  },
};
</script>

<style scoped>
.success-btn {
  background: var(--primary) !important;
  border: solid 2px var(--primary) !important;
  color: white !important;
  border-radius: 16px;
}
.selecImage {
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-input {
  display: block;
  width: 120px;
  height: 120px;
  cursor: pointer;
  border-radius: 50% !important;
  background-size: cover;
  background: #004fa3;
  background-position: center center;
}

.placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 18px;
}

.file-input {
  display: none;
}
</style>
