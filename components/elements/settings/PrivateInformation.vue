<template>
  <div class="privateInformation">
    <p class="text-h6">{{ $t("personal_information") }}</p>
    <v-card class="mainCard pt-6">
      <div class="text-center">
        <div class="selecImage">
          <div
            class="image-input"
            :style="{ 'background-image': `url(${imageData})` }"
            @click="chooseImage"
          >
            <span v-if="!imageData" class="placeholder text-gray--text">
              <v-icon size="70">mdi-camera</v-icon>
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
            <v-card-actions class="text-center d-flex justify-center">
              <v-btn
                class="mr-4 success-btn ml-2 mb-4"
                :style="customStyle"
                @click="validate"
                elevation="0"
                large
                dark
                :loading="loading"
              >
                {{ $t("saveAccountSettings") }}
              </v-btn>
            </v-card-actions>
          </v-row>
        </v-container>
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
      start_gradient: config.themes.dark.start_gradient,
      end_gradient: config.themes.dark.end_gradient,
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
      formData: null,
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
      console.log("user_data", user_data);
      let rs = await this.$axios.put(
        `/api/platform/user_platform/${user_data.id}`,
        user_data,
        {}
      );
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
          .then((rsp) => {})
          .catch(function (e) {
            console.log("== == !! UPLOAD FAIL", e);
            return;
          });
      }

      console.log("rs", rs);
      setTimeout(() => {
        this.loading = false;
      }, 500);
    },
  },
  mounted() {
    console.log("user_data", this.$auth.user);
    if (this.$auth.user.fs && this.$auth.user.fs.length > 0) {
      let dir = this.$env("FILE_SERVER_BASE") + this.$auth.user.fs[0].dir;
      if (dir) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imageData = e.target.result;
        };
        reader.readAsDataURL(dir);
      }
    }
  },
  computed: {
    ...mapGetters("data/countries", {
      countries: "list",
    }),

    customStyle() {
      return {
        "--start_gradient": this.start_gradient,
        "--end_gradient": this.end_gradient,
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
  width: 120px;
  height: 120px;
  cursor: pointer;
  border-radius: 50% !important;
  border: 2px solid #32fa5d;
  background-size: cover;
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
