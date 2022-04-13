<template>
  <div>
    <v-dialog width="500" v-model="cardDialog">
      <v-card>
        <div class="d-flex pa-5 white--text font-weight-black title">
          <v-spacer></v-spacer>
          <v-btn icon @click="$emit('cardDialogChanger')">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
        <v-form :lazy-validation="false" v-model="valid">
          <v-card-text class="pb-6">
            <v-row>
              <v-col cols="12" class="pb-0 card">
                <v-subheader
                  class="grey--text text--lighten-1 pl-0 subheader"
                  >{{ $t("card_number") }}</v-subheader
                >
                <v-text-field
                  v-model="card_number"
                  mask="credit-card"
                  :rules="cardRules"
                  class="card_input"
                  maxlength="19"
                  single-line
                  outlined
                  dense
                />
                <template>
                  <v-fade-transition leave-absolute>
                    <img
                      class="card_input__icon"
                      width="24"
                      height="24"
                      :src="data.card_icon"
                      alt=""
                    />
                  </v-fade-transition>
                </template>
              </v-col>

              <v-col cols="12" class="pb-0">
                <v-subheader
                  class="grey--text text--lighten-1 pl-0 subheader"
                  >{{ $t("cardholder_name") }}</v-subheader
                >
                <v-text-field
                  single-line
                  outlined
                  label=""
                  dense
                  v-model="data.user_name"
                  type="text"
                  :rules="nameRules"
                />
              </v-col>

              <v-col cols="8">
                <v-subheader
                  class="grey--text text--lighten-1 pl-0 subheader"
                  >{{ $t("expiry") }}</v-subheader
                >
                <v-text-field
                  label="MM/YY"
                  :rules="expireDateRules"
                  outlined
                  dense
                  maxlength="5"
                  v-model="exp_date"
                />
              </v-col>

              <v-col cols="4">
                <v-subheader class="grey--text text--lighten-1 pl-0 subheader"
                  >CVV</v-subheader
                >
                <v-text-field
                  :append-icon="showCVV ? 'visibility_off' : 'visibility'"
                  :type="showCVV ? 'text' : 'password'"
                  @click:append="showCVV = !showCVV"
                  v-model="data.cvv"
                  :rules="cvvRules"
                  maxlength="3"
                  single-line
                  outlined
                  dense
                />
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn
              :disabled="!btnDisable"
              dark
              elevation="0"
              @click="addCardNumber"
              large
              :style="customStyle"
              class="mb-4 ml-2 success-btn"
              >{{ $t("add_card") }}
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
const validateExpDate = (value) => {
  const monthAndYear = value.split("/");
  const valueDate = new Date();
  valueDate.setFullYear(parseInt(`20${monthAndYear[1]}`), +monthAndYear[0], 1);
  const today = new Date();
  return valueDate > Date.parse(today);
};
const validateExpMonth = (value) => {
  const monthAndYear = value.split("/");
  return +monthAndYear[0] < 13 && +monthAndYear[0] !== 0;
};
const validateIsNumber = (value) => {
  let stringValue = value.split(" ").join("");
  return /^\d+$/.test(stringValue);
};
const validateNumberLength = (value) => {
  let stringValue = value.split(" ").join("");
  return stringValue.length === 16;
};
import config from "~/config/config.json";
export default {
  name: "BankCard",
  props: {
    cardDialog: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      data: {
        expire_date: "",
        card_number: "",
        user_name: "",
        cvv: "",
        card_icon: "https://www.svgrepo.com/show/103010/credit-card.svg",
      },
      start_gradient: config.themes.dark.start_gradient,
      end_gradient: config.themes.dark.end_gradient,
      showCVV: false,
      card_number: "",
      exp_date: "",
      valid: false,
      cardRules: [
        (v) => !!v || this.$t("card_number_required"),
        (v) => (v && validateNumberLength(v)) || this.$t("card_rules"),
        (v) => (v && validateIsNumber(v)) || this.$t("card_rules_number"),
      ],
      nameRules: [(v) => !!v || this.$t("cardholder_name_required")],
      expireDateRules: [
        (v) => !!v || this.$t("card_expiry_required"),
        (v) => (v && v.length == 5) || this.$t("invalid_date"),
        (v) => (v && validateExpMonth(v)) || this.$t("invalid_date"),
        (v) => (v && validateExpDate(v)) || this.$t("your_card_expired"),
      ],
      cvvRules: [
        (v) => !!v || this.$t("CVV_required"),
        (v) => (v && v.length == 3) || this.$t("CVV_rules"),
        (v) => (v && validateIsNumber(v)) || this.$t("card_rules_number"),
      ],
      years: [],
    };
  },
  methods: {
    addCardNumber() {
      let cards = localStorage.getItem("bank_cards");
      let c_json = JSON.parse(cards);
      let list = [];
      if (c_json) {
        list = c_json;
      }
      list.push(this.data);
      localStorage.setItem("bank_cards", JSON.stringify(list));
      this.$emit("save");
      this.data.user_name = "";
      this.data.cvv = "";
      this.card_number = "";
      this.exp_date = "";
    },
  },
  watch: {
    exp_date(v) {
      if (v.length == 2) {
        this.exp_date += "/";
      }
      this.data.expire_date = v;
    },
    card_number(v) {
      if (v.length == 4 || v.length == 9 || v.length == 14) {
        this.card_number += " ";
      }
      this.data.card_number = v;
    },
    getCardType(v) {
      if (v === "visa") {
        this.data.card_icon =
          "https://upload.wikimedia.org/wikipedia/commons/d/d6/Visa_2021.svg";
      } else if (v === "mastercard") {
        this.data.card_icon =
          "https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg";
      } else {
        this.data.card_icon =
          "https://www.svgrepo.com/show/103010/credit-card.svg";
      }
    },
  },
  computed: {
    customStyle() {
      return {
        "--start_gradient": this.start_gradient,
        "--end_gradient": this.end_gradient,
      };
    },
    getCardType() {
      let number = this.card_number;
      let re = new RegExp("^4");
      if (number.match(re) != null) return "visa";
      re = new RegExp("^5[1-5]");
      if (number.match(re) != null) return "mastercard";
      // re = new RegExp("^(34|37)");
      // if (number.match(re) != null) return (this.data.card_type = "amex");
      // re = new RegExp("^6011");
      // if (number.match(re) != null) return (this.data.card_type = "discover");
      // re = new RegExp("^9792");
      // if (number.match(re) != null) return (this.data.card_type = "troy");
      return ""; // default type
    },
    btnDisable() {
      // return (
      //   this.data.card_number &&
      //   this.data.user_name &&
      //   this.data.expire_date &&
      //   this.data.cvv
      // );
      return this.valid;
    },
  },
  mounted() {},
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
.v-subheader {
  height: 32px;
  margin-left: 6px;
}
.card_input,
.card {
  position: relative;
}
.card_input__icon {
  position: absolute;
  content: "";
  top: 52px;
  right: 24px;
  bottom: 0;
}
</style>
