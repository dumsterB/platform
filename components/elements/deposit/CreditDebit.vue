<template>
  <div class="pt-4">
    <div class="payment_card">
      <div class="card_item pa-6" :style="customStyle">
        <p class="mb-12">{{ $t("payment_card") }} #{{ 1 }}</p>
        <p class="mb-12 card_item_number" v-if="selected_card">
          {{
            selected_card && selected_card !== -1
              ? selected_card
              : "---- ---- ---- ----"
          }}
        </p>
        <v-row class="justify-space-between align-center">
          <img
            v-for="(item, i) in items"
            v-if="selected_card && selected_card === item.card_number"
            :key="i"
            width="40"
            height="20"
            :src="item.card_icon"
          />
          <p class="mb-0 font-weight-thin text-right">
            {{ fee }}% {{ $t("fee") }}
          </p>
        </v-row>
        <v-card class="card_data">
          <v-form :lazy-validation="false" v-model="valid">
            <v-card-text class="pb-6">
              <v-row>
                <v-col>
                  <v-autocomplete
                    v-model="selected_card"
                    :items="items"
                    chips
                    hide-details
                    item-text="card_number"
                    item-value="card_number"
                    :label="$t('choose_card')"
                    solo
                    single-line
                    outlined
                    dense
                    class="card_list"
                    :style="customStyle"
                    height="52"
                    append-icon="mdi-chevron-down"
                  >
                    <template v-slot:selection="{ attr, on, item, selected }">
                      <v-chip
                        v-bind="attr"
                        :input-value="selected"
                        class="icon_color--text"
                        v-on="on"
                      >
                        <img
                          width="24"
                          height="24"
                          :src="item.card_icon"
                          class="ma-0 mr-6"
                        />
                        <p class="ma-0">
                          {{ `**** **** **** ${item.card_number.slice(-4)}` }}
                        </p>
                      </v-chip>
                    </template>
                    <template v-slot:item="{ item }">
                      <v-list-item-avatar
                        class="text-h5 font-weight-light icon_color--text avatar"
                      >
                        <img width="14" height="14" :src="item.card_icon" />
                      </v-list-item-avatar>
                      <v-list-item-content>
                        <v-list-item-title>{{
                          item.card_number
                        }}</v-list-item-title>
                      </v-list-item-content>
                      <v-list-item-action @click="delete_card(item)">
                        <v-icon>mdi-close</v-icon>
                      </v-list-item-action>
                    </template>
                    <template v-slot:append-item>
                      <div class="d-flex pl-4 pr-4" style="cursor: pointer">
                        <v-list-item-avatar
                          class="text-h5 font-weight-light icon_color--text avatar"
                          @click="cardDialogChanger"
                        >
                          <v-icon class="icon_color--text" size="40" dark
                            >mdi-plus</v-icon
                          >
                        </v-list-item-avatar>
                        <v-list-item-content @click="cardDialogChanger">
                          <v-list-item-title>{{
                            $t("addNewPayment")
                          }}</v-list-item-title>
                        </v-list-item-content>
                      </div>
                    </template>
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" class="pb-0 py-0 card">
                  <v-subheader
                    class="grey--text text--lighten-1 pl-0 subheader"
                    >{{ $t("amount") }}</v-subheader
                  >
                  <v-text-field
                    v-model="amounty"
                    :rules="amountyRules"
                    class=""
                    type="number"
                    single-line
                    outlined
                    dense
                  />
                </v-col>
                <div class="mb-0 mt-0 ml-auto mr-auto">
                  <span> {{ $t("pay") }}: </span>
                  <span class="primary--text ml-1">
                    {{ amountyFee(amounty) }}
                  </span>
                </div>
              </v-row>
            </v-card-text>
            <v-card-actions class="mb-8 ml-2 mr-2 justify-center py-0">
              <v-btn
                :style="customStyle"
                dark
                elevation="0"
                large
                @click="run_order"
                class="success-btn"
                :disabled="!btnDisable"
                :loading="loading"
                >{{ loading ? "" : $t("to_continue") }}
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </div>
    </div>
    <BankCard
      :cardDialog="cardDialog"
      @save="save"
      @cardDialogChanger="cardDialogChanger"
    ></BankCard>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import config from "~/config/config.json";
import BankCard from "../../modals/BankCard";
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

export default {
  name: "CreditDebit",
  components: {
    BankCard,
  },
  data() {
    return {
      payment_card_box_shadow: config.colors.payment_card_box_shadow,
      primary: config.themes.dark.primary,
      white: config.themes.light.item_bg,
      dark_disabled: config.colors.dark_disabled_primary_btn,
      light_disabled: config.colors.light_disabled_primary_btn,
      card_number: "",
      amounty: "",
      valid: false,
      loading: false,
      items: [],
      cardDialog: false,
      selected_card: -1,
      fee: 1.2,
      amountyRules: [
        (v) => !!v || this.$t("amount_required"),
        (v) => (v && Number(v) > 19) || this.$t("from_only"),
        (v) => (v && v.length < 5) || this.$t("amount_ruls"),
      ],
    };
  },
  methods: {
    ...mapActions("data/order", {
      order_create: "create",
      fetchOrders: "fetchList",
    }),
    cardDialogChanger() {
      this.cardDialog = !this.cardDialog;
    },
    amountyFee(val) {
      let sum = (Number(val) / 100) * this.fee;
      let total = sum + Number(val);
      return total;
    },
    save() {
      let d = localStorage.getItem("bank_cards");
      if (d) {
        this.items = JSON.parse(d) || [];
        if (this.items && this.items.length > 0) {
          this.selected_card = 0;
        }
        this.cardDialog = false;
      }
    },
    delete_card(item) {
      let d = localStorage.getItem("bank_cards");
      let items = d ? JSON.parse(d) : [];
      let new_arr = [];
      items.forEach((el) => {
        if (el.card_number != item.card_number) {
          new_arr.push(el);
        }
      });
      localStorage.setItem("bank_cards", JSON.stringify(new_arr));
      this.items = new_arr;
      if (this.items && this.items.length > 0) {
        this.selected_card = 0;
      } else {
        this.selected_card = -1;
      }
    },
    async run_order() {
      this.loading = true;
      let order_data = {};
      let curr = this.currencies.find((el) => el.symbol == "USD");
      if (curr) {
        order_data.source_currency_id = curr.id;
      }
      order_data.source_amount = parseFloat(this.amounty);
      order_data.dest_currency_id = curr.id;
      order_data.dest_amount = parseFloat(this.amounty);
      order_data.exchange_rate = 1;
      order_data.order_type_id = 2;
      order_data.order_method_id = 1;
      // console.log("order_data", order_data);
      let rs = await this.order_create({ data: order_data });
      let title, color;
      if (rs.data && rs.data.order_status_id == 2) {
        title = this.$t("order_failed");
        color = "error";
      } else {
        title = this.$t("create_order_progress");
        color = "warning";
      }
      this.$store.commit("data/notifications/create", {
        id: color + "_" + Math.random().toString(36),
        title: title,
        text: title,
        color: color,
        timeout: 5000,
      });
      await this.fetchOrders();
      this.loading = false;
    },
  },
  watch: {
    // exp_date(v) {
    //   if (v.length == 2) {
    //     this.exp_date += "/";
    //   }
    //   this.data.expire_date = v;
    // },
    // card_number(v) {
    //   if (v.length == 4 || v.length == 9 || v.length == 14) {
    //     this.card_number += " ";
    //   }
    //   this.data.card_number = v;
    // },
  },
  computed: {
    ...mapGetters("data/currency", {
      currencies: "list",
    }),
    customStyle() {
      return {
        "--primary": this.primary,
        "--payment_card_box_shadow": this.payment_card_box_shadow,
        "--white": this.white,
        "--dark_disabled": this.dark_disabled,
        "--light_disabled": this.light_disabled,
      };
    },

    btnDisable() {
      return this.valid;
    },
  },
  mounted() {
    let d = localStorage.getItem("bank_cards");
    if (d) {
      this.items = JSON.parse(d) || [];
      if (this.items && this.items.length > 0) {
        this.selected_card = 0;
      }
    }
  },
};
</script>

<style scoped lang="scss">
.v-dialog {
  border-radius: 10px;
}

html[theme="dark"] .card_data {
  border-top-left-radius: 0px !important;
  border-top-right-radius: 0px !important;
}

html[theme="light"] .card_data {
  border-top-left-radius: 0px !important;
  border-top-right-radius: 0px !important;
}

html[theme="dark"] .success-btn {
  width: 100% !important;
  font-weight: 700;
  font-size: 18px;
  line-height: 22px;
  letter-spacing: -1px;
  text-transform: inherit;
  color: white !important;
  background-color: var(--primary) !important;
  border-radius: 10px;
  &:disabled {
    cursor: not-allowed;
    background: linear-gradient(
        0deg,
        var(--dark_disabled),
        var(--dark_disabled)
      ),
      var(--primary) !important;
  }
}
html[theme="light"] .success-btn {
  width: 100% !important;
  font-weight: 700;
  font-size: 18px;
  line-height: 22px;
  letter-spacing: -1px;
  text-transform: inherit;
  color: white !important;
  background-color: var(--primary) !important;
  border-radius: 10px;
  &:disabled {
    cursor: not-allowed;
    background: linear-gradient(
        0deg,
        var(--light_disabled),
        var(--light_disabled)
      ),
      var(--primary) !important;
  }
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
.payment_card {
  position: relative;
  height: 600px;
  background: transparent !important;
  border-radius: 10px;
  box-shadow: none;
}
.card_item {
  position: relative;
  width: 100%;
  height: 252px;
  background: var(--primary) !important;
  color: var(--white);
  box-shadow: inset -8px -6px 80px var(--payment_card_box_shadow);
  border-radius: 10px;
  font-weight: 400;
  font-size: 24px;
  line-height: 28px;
}
.card_item_number {
  font-size: 32px;
  line-height: 38px;
  letter-spacing: 4px;
}
.card_data {
  position: absolute;
  content: "";
  top: 252px;
  width: 80%;
  margin: 0 auto;
}
.card_data {
  background: transparent !important;
  border: none !important;
}
.card_list {
  border-radius: 10px !important;

  border: 1px solid #bcbcbc1a;
}
html[theme="light"] .card_list,
.avatar {
  background: var(--light_text_color) !important;
}
html[theme="dark"] .card_list,
.avatar {
  background: var(--dark_text_color) !important;
}
</style>
