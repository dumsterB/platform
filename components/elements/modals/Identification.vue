<template>
  <div>
    <v-dialog v-model="dialog" width="800">
      <template v-slot:activator="{ on, attrs }">
        <div v-bind="attrs" v-on="on">
          <v-btn dark elevation="0" :style="customStyle" class="success-btn">{{
            $t("verify_now")
          }}</v-btn>
        </div>
      </template>
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          {{ $t("s1_basic_verification") }}
        </v-card-title>
        <div class="pa-5">
          <h4>{{ $t("document_examples") }}</h4>
          <v-col>
            <v-select
              value="few"
              v-model="selectCountry"
              filled
              outlined
              :items="countries"
              required
            ></v-select>
          </v-col>
          <h4>{{ $t("document_type") }}</h4>
          <v-row>
            <v-col>
              <v-checkbox
                v-model="CheckboxType"
                :label="$t('passport_title')"
                value="passport"
              ></v-checkbox>
            </v-col>
            <v-col>
              <v-checkbox
                v-model="CheckboxType"
                label="ID Карта"
                value="id_card"
              ></v-checkbox>
            </v-col>
          </v-row>
          <div>
            <h4>{{ $t("phote_of_documents") }}</h4>
            <br />
            <p>
              <strong>{{ $t("bright_and_clear") }}</strong>
              {{ $t("good_quality") }}
            </p>
            <p>
              <strong> {{ $t("uncut") }}</strong>
              {{ $t("doc_should_be_visible") }}
            </p>
          </div>
          <div class="text-center" v-if="CheckboxType === 'passport'">
            <div class="selecImage">
              <div
                class="image-input"
                :style="{ 'background-image': `url(${imageData})` }"
                @click="chooseImage"
              >
                <span v-if="!imageData" class="placeholder">
                  <div>
                    <v-icon size="70">mdi-cloud-upload-outline</v-icon>
                    <br />
                    <p>{{ $t("choose_photo") }}</p>
                  </div>
                </span>
                <input
                  class="file-input"
                  ref="fileInput"
                  type="file"
                  @input="onSelectFile"
                />
              </div>
            </div>
          </div>
          <div v-else>
            <v-row>
              <v-col>
                <div class="text-center">
                  <div class="selecImage">
                    <div
                      class="image-input"
                      :style="{ 'background-image': `url(${imageData})` }"
                      @click="chooseImage"
                    >
                      <span v-if="!imageData" class="placeholder">
                        <div>
                          <v-icon size="70">mdi-cloud-upload-outline</v-icon>
                          <br />
                          <p>{{ $t("choose_photo") }}</p>
                        </div>
                      </span>
                      <input
                        class="file-input"
                        ref="fileInput"
                        type="file"
                        @input="onSelectFile"
                      />
                    </div>
                  </div>
                </div>
              </v-col>
              <v-col>
                <div class="text-center">
                  <div class="selecImage">
                    <div
                      class="image-input"
                      :style="{ 'background-image': `url(${imageData})` }"
                      @click="chooseImage"
                    >
                      <span v-if="!imageData" class="placeholder">
                        <div>
                          <v-icon size="70">mdi-cloud-upload-outline</v-icon>
                          <br />
                          <p>{{ $t("choose_photo") }}</p>
                        </div>
                      </span>
                      <input
                        class="file-input"
                        ref="fileInput"
                        type="file"
                        @input="onSelectFile"
                      />
                    </div>
                  </div>
                </div>
              </v-col>
            </v-row>
          </div>
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
  methods: {
    GetCodePhoneNumber() {
      console.log("clicked");
    },
    chooseImage() {
      this.$refs.fileInput.click();
    },
    onSelectFile() {
      const input = this.$refs.fileInput;
      const files = input.files;
      if (files && files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imageData = e.target.result;
        };
        reader.readAsDataURL(files[0]);
        this.$emit("input", files[0]);
      }
    },
  },
  data() {
    return {
      start_gradient: config.themes.dark.start_gradient,
      end_gradient: config.themes.dark.end_gradient,
      dialog: false,
      imageData: null,
      CheckboxType: "",
      selectCountry: "",
      countries: [
        "Afghanistan",
        "Albania",
        "Algeria",
        "American Samoa",
        "Andorra",
        "Angola",
        "Anguilla",
        "Antigua and Barbuda",
        "Argentina",
        "Armenia",
        "Aruba",
        "Australia",
        "Austria",
        "Azerbaijan",
        "Bangladesh",
        "Barbados",
        "Bahamas",
        "Bahrain",
        "Belarus",
        "Belgium",
        "Belize",
        "Benin",
        "Bermuda",
        "Bhutan",
        "Bolivia",
        "Bosnia and Herzegovina",
        "Botswana",
        "Brazil",
        "British Indian Ocean Territory",
        "British Virgin Islands",
        "Brunei Darussalam",
        "Bulgaria",
        "Burkina Faso",
        "Burma",
        "Burundi",
        "Cambodia",
        "Cameroon",
        "Canada",
        "Cape Verde",
        "Cayman Islands",
        "Central African Republic",
        "Chad",
        "Chile",
        "China",
        "Christmas Island",
        "Cocos (Keeling) Islands",
        "Colombia",
        "Comoros",
        "Congo-Brazzaville",
        "Congo-Kinshasa",
        "Cook Islands",
        "Costa Rica",
        "Croatia",
        "Cura?ao",
        "Cyprus",
        "Czech Republic",
        "Denmark",
        "Djibouti",
        "Dominica",
        "Dominican Republic",
        "East Timor",
        "Ecuador",
        "El Salvador",
        "Egypt",
        "Equatorial Guinea",
        "Eritrea",
        "Estonia",
        "Ethiopia",
        "Falkland Islands",
        "Faroe Islands",
        "Federated States of Micronesia",
        "Fiji",
        "Finland",
        "France",
        "French Guiana",
        "French Polynesia",
        "French Southern Lands",
        "Gabon",
        "Gambia",
        "Georgia",
        "Germany",
        "Ghana",
        "Gibraltar",
        "Greece",
        "Greenland",
        "Grenada",
        "Guadeloupe",
        "Guam",
        "Guatemala",
        "Guernsey",
        "Guinea",
        "Guinea-Bissau",
        "Guyana",
        "Haiti",
        "Heard and McDonald Islands",
        "Honduras",
        "Hong Kong",
        "Hungary",
        "Iceland",
        "India",
        "Indonesia",
        "Iraq",
        "Ireland",
        "Isle of Man",
        "Israel",
        "Italy",
        "Jamaica",
        "Japan",
        "Jersey",
        "Jordan",
        "Kazakhstan",
        "Kenya",
        "Kiribati",
        "Kuwait",
        "Kyrgyzstan",
        "Laos",
        "Latvia",
        "Lebanon",
        "Lesotho",
        "Liberia",
        "Libya",
        "Liechtenstein",
        "Lithuania",
        "Luxembourg",
        "Macau",
        "Macedonia",
        "Madagascar",
        "Malawi",
        "Malaysia",
        "Maldives",
        "Mali",
        "Malta",
        "Marshall Islands",
        "Martinique",
        "Mauritania",
        "Mauritius",
        "Mayotte",
        "Mexico",
        "Moldova",
        "Monaco",
        "Mongolia",
        "Montenegro",
        "Montserrat",
        "Morocco",
        "Mozambique",
        "Namibia",
        "Nauru",
        "Nepal",
        "Netherlands",
        "New Caledonia",
        "New Zealand",
        "Nicaragua",
        "Niger",
        "Nigeria",
        "Niue",
        "Norfolk Island",
        "Northern Mariana Islands",
        "Norway",
        "Oman",
        "Pakistan",
        "Palau",
        "Panama",
        "Papua New Guinea",
        "Paraguay",
        "Peru",
        "Philippines",
        "Pitcairn Islands",
        "Poland",
        "Portugal",
        "Puerto Rico",
        "Qatar",
        "R?union",
        "Romania",
        "Russia",
        "Rwanda",
        "Saint Barth?lemy",
        "Saint Helena",
        "Saint Kitts and Nevis",
        "Saint Lucia",
        "Saint Martin",
        "Saint Pierre and Miquelon",
        "Saint Vincent",
        "Samoa",
        "San Marino",
        "S?o Tom? and Pr?ncipe",
        "Saudi Arabia",
        "Senegal",
        "Serbia",
        "Seychelles",
        "Sierra Leone",
        "Singapore",
        "Sint Maarten",
        "Slovakia",
        "Slovenia",
        "Solomon Islands",
        "Somalia",
        "South Africa",
        "South Georgia",
        "South Korea",
        "Spain",
        "Sri Lanka",
        "Sudan",
        "Suriname",
        "Svalbard and Jan Mayen",
        "Sweden",
        "Swaziland",
        "Switzerland",
        "Syria",
        "Taiwan",
        "Tajikistan",
        "Tanzania",
        "Thailand",
        "Togo",
        "Tokelau",
        "Tonga",
        "Trinidad and Tobago",
        "Tunisia",
        "Turkey",
        "Turkmenistan",
        "Turks and Caicos Islands",
        "Tuvalu",
        "Uganda",
        "Ukraine",
        "United Arab Emirates",
        "United Kingdom",
        "United States",
        "Uruguay",
        "Uzbekistan",
        "Vanuatu",
        "Vatican City",
        "Vietnam",
        "Venezuela",
        "Wallis and Futuna",
        "Western Sahara",
        "Yemen",
        "Zambia",
        "Zimbabwe",
      ],
    };
  },
  mounted() {
    this.selectCountry = this.countries[0];
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
.selecImage {
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-input {
  display: block;
  width: 100%;
  height: 300px;
  cursor: pointer;
  border: 2px solid lightgray;
  background-size: cover;
  background-position: center center;
}

.placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #333;
  font-size: 18px;
}

.file-input {
  display: none;
}
</style>
