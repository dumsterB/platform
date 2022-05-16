<template>
  <div>
    <v-dialog id="dialog" v-model="dialog" width="600" persistent>
      <v-card class="pl-12 pr-12 pt-8 pb-12" :style="customStyle">
        <v-row>
          <v-col>
            <p class="text-h5 text-center font-weight-bold">
              {{ $t(action) }}
            </p>
            <p
              class="text-h6 text-gray--text mt-1 text-center font-weight-light"
            >
              {{ $t("choose_payment_method") }}
            </p>
          </v-col>
          <v-btn
            elevation="0"
            @click="close"
            icon
            class="mt-2 mr-2 accent--text"
          >
            <v-icon class="accent--text">mdi-close</v-icon>
          </v-btn>
        </v-row>
        <template>
          <v-container fluid class="paymentMethod ma-0 mb-8 pa-0">
            <v-bottom-navigation
              height="100"
              background-color="transparent"
              v-model="selectedPaymentMethod"
              class="justify-space-between"
            >
              <v-btn
                value="bankCard"
                class="paymentMethod_checkbox mainBorderRadius pl-8 pr-8"
                active-class="primary paymentMethod_checkbox_active"
                :style="customStyle"
              >
                <v-icon class="mr-4">mdi-credit-card-multiple-outline</v-icon>
                <div class="d-flex flex-wrap align-center">
                  <p class="mr-4 mb-0 font-weight-bold">Bank Card</p>
                  <p class="mb-0 font-weight-thin">1.2% {{ $t("fee") }}</p>
                </div>
              </v-btn>
              <v-btn
                value="crypto"
                class="paymentMethod_checkbox mainBorderRadius pl-8 pr-8"
                active-class="primary paymentMethod_checkbox_active"
                :style="customStyle"
              >
                <v-icon class="mr-4">mdi-currency-btc</v-icon>
                <div class="d-flex flex-wrap align-center">
                  <p class="mr-4 mb-0 font-weight-bold">Crypto</p>
                  <p class="mb-0 font-weight-thin">1.2% {{ $t("fee") }}</p>
                </div>
              </v-btn>
            </v-bottom-navigation>
          </v-container>
        </template>
        <v-autocomplete
          v-if="items.length > 0 && selectedPaymentMethod === `bankCard`"
          v-model="selected_card"
          :items="items"
          chips
          hide-details
          item-text="card_number"
          item-value="card_number"
          :label="$t('choose_card')"
          solo
          class="card_list"
          :style="customStyle"
          height="52"
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
              <v-list-item-title>{{ item.card_number }}</v-list-item-title>
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
                <v-list-item-title>{{ $t("addNewPayment") }}</v-list-item-title>
              </v-list-item-content>
            </div>
          </template>
        </v-autocomplete>

        <div v-if="items.length === 0" class="text-center">
          <div class="d-block">
            <div
              class="credit-card-add item_bg"
              @click="cardDialogChanger"
              :style="customStyle"
            >
              <div>
                <v-icon
                  class="icon_color--text"
                  style="margin-top: 10px"
                  size="32"
                  dark
                  >mdi-plus</v-icon
                >
                <p class="icon_color--text">
                  {{ $t("addNewPayment") }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <v-row
          v-if="items.length > 0 && selectedPaymentMethod === `bankCard`"
          class="mt-4 pa-0"
        >
          <v-col cols="12" sm="12" md="12">
            <v-text-field
              v-model="enteredMoney"
              outlined
              :label="$t('enter_your_amount')"
              class="amount"
              type="number"
              :error-messages="err_m"
              :style="customStyle"
              background-color="item_bg"
            ></v-text-field>
            <p class="text-gray--text font-weight-light ruls">
              {{ $t("deposit_ruls") }}
            </p>
          </v-col>
          <div class="mb-6 ml-auto mr-auto">
            <span> {{ $t("pay") }}: </span>
            <span class="primary--text ml-1">
              {{ enteredMoney }} {{ curr }}</span
            >
          </div>
        </v-row>
        <v-col
          v-if="items.length > 0 && selectedPaymentMethod === `crypto`"
          class="pa-0 m-0"
        >
          <v-autocomplete
            v-model="selected_currencies"
            :items="currencies"
            :label="$t('choose_crypto')"
            class="card_list mb-7"
            height="52"
            item-text="name"
            item-value="symbol"
            solo
            dense
            hide-details
          >
            <template v-slot:item="{ item }">
              <img height="24" width="24" :src="item.logo" />
              <p class="ml-4 mt-3">{{ item.name }}</p>
            </template>
          </v-autocomplete>
          <v-row class="d-flex ma-0 pa-0">
            <v-text-field
              v-model="enteredCrypto"
              outlined
              :label="$t('enter_amount')"
              class="amount mr-2"
              type="number"
              :error-messages="err_m"
              :style="customStyle"
              background-color="item_bg"
            ></v-text-field>
            <v-text-field
              v-model="amountCrypto"
              disabled
              outlined
              :label="$t('amount_choosed')"
              class="amount ml-2"
              type="number"
              :error-messages="err_m"
              :style="customStyle"
              background-color="item_bg"
            ></v-text-field>
          </v-row>
          <p class="text-gray--text font-weight-light ruls pb-3">
            {{ $t("deposit_ruls") }}
          </p>
          <div class="mb-6 ml-auto mr-auto d-flex justify-center">
            <span> {{ $t("pay") }}: </span>
            <span class="primary--text ml-1">
              {{ enteredCrypto }} {{ crypto_curr }}</span
            >
          </div>
        </v-col>
        <v-card-actions v-if="items.length > 0">
          <v-btn
            large
            dark
            class="success-btn ml-auto mr-auto"
            :style="customStyle"
            text
            :disabled="Boolean(!selected_card)"
            :loading="loading"
            @click="make_order"
            width="332"
          >
            {{ $t(action) }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <BankCard
      :cardDialog="cardDialog"
      @save="save"
      @cardDialogChanger="cardDialogChanger"
    ></BankCard>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import BankCard from "../modals/BankCard";
import config from "~/config/config.json";

export default {
  components: {
    BankCard,
  },
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
    wallet: null,
    action: {
      type: String,
      default: "",
    },
  },
  name: "Deposit",
  data() {
    return {
      selectedPaymentMethod: "bankCard",
      start_gradient: config.themes.dark.start_gradient,
      end_gradient: config.themes.dark.end_gradient,
      light_text_color: config.themes.light.item_bg,
      dark_text_color: config.themes.dark.item_bg,
      light_drop_shadow: config.themes.light.drop_shadow,
      dark_drop_shadow: config.themes.dark.drop_shadow,
      icon_color: config.colors.icon_color,
      box_shadow: config.colors.box_shadow,
      light_background: config.themes.light.background,
      dark_background: config.themes.dark.background,
      primary: config.themes.dark.primary,
      dark_disabled: config.colors.dark_disabled_primary_btn,
      light_disabled: config.colors.light_disabled_primary_btn,
      selectedItem: 1,
      cardDialog: false,
      enteredMoney: "",
      enteredCrypto: "",
      amountCrypto: 0,
      items: [],
      selected_card: -1,
      selected_currencies: false,
      loading: false,
      curr: "USD",
      crypto_curr: "BTC",
      err_m: [],
    };
  },
  computed: {
    ...mapGetters("data/currency", {
      currencies: "list",
    }),
    customStyle() {
      return {
        "--start_gradient": this.start_gradient,
        "--end_gradient": this.end_gradient,
        "--light_text_color": this.light_text_color,
        "--dark_text_color": this.dark_text_color,
        "--light_drop_shadow": this.light_drop_shadow,
        "--dark_drop_shadow": this.dark_drop_shadow,
        "--icon_color": this.icon_color,
        "--box_shadow": this.box_shadow,
        "--light_background": this.light_background,
        "--dark_background": this.dark_background,
        "--primary": this.primary,
        "--dark_disabled": this.dark_disabled,
        "--light_disabled": this.light_disabled,
      };
    },
  },
  methods: {
    ...mapActions("data/order", {
      order_create: "create",
      fetchOrders: "fetchList",
    }),
    ...mapActions("data/wallet", {
      f_wallets: "fetchList",
    }),
    close() {
      this.enteredMoney = "";
      this.enteredCrypto = "";
      this.$emit("depositChanger");
    },
    cardDialogChanger() {
      this.cardDialog = !this.cardDialog;
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
    async make_order() {
      if (this.selected_card) {
        if (!this.enteredMoney) {
          this.err_m = [this.$t("enter_amount")];
          return;
        } else {
          this.err_m = [];
        }
        this.loading = true;
        let order_data = {};
        let curr;
        if (!this.wallet) {
          curr = this.currencies.find((el) => el.symbol == "USD");
        } else {
          curr = this.wallet.currency;
          this.curr = curr.symbol;
        }
        if (curr) {
          order_data.source_currency_id = curr.id;
        }
        order_data.source_amount = parseFloat(this.enteredMoney);
        order_data.dest_currency_id = curr.id;
        order_data.dest_amount = parseFloat(this.enteredMoney);
        order_data.exchange_rate = 1;
        if (this.action == "deposit_title") {
          order_data.order_type_id = 2;
        }
        if (this.action == "withdraw") {
          order_data.order_type_id = 1;
        }
        order_data.order_method_id = 1;
        // console.log("order_data", order_data);
        let rs = await this.order_create({ data: order_data });
        let title, color;
        if (rs.data && rs.data.order_status_id != 3) {
          title = this.$t("order_failed");
          color = "error";
        } else {
          title = this.$t("create_order_progress");
          color = "warning";
          // setTimeout(() => {
          //   this.$store.commit("data/notifications/create", {
          //     id: color + "_" + Math.random().toString(36),
          //     title: this.$t("create_order_done"),
          //     text: this.$t("create_order_done"),
          //     color: "primary",
          //   });
          // }, 2500);
        }
        this.$store.commit("data/notifications/create", {
          id: color + "_" + Math.random().toString(36),
          title: title,
          text: title,
          color: color,
          timeout: 5000,
        });
        await this.f_wallets();
        await this.fetchOrders();
        this.loading = false;
        this.$emit("depositChanger", true);
      }
    },
  },
  watch: {
    wallet() {
      if (this.wallet && this.wallet.currency) {
        this.curr = this.wallet.currency.symbol;
      }
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
.card_list {
  border-radius: 10px !important;
}
html[theme="light"] .card_list,
.avatar {
  background: var(--light_text_color) !important;
}
html[theme="dark"] .card_list,
.avatar {
  background: var(--dark_text_color) !important;
}
.ruls {
  font-weight: 300;
  font-size: 12px;
  line-height: 14px;
}
.v-card {
  box-shadow: 0px 10px 30px var(--box_shadow);
  border-radius: 10px !important;
}
html[theme="dark"] .v-card {
  background: var(--dark_background) !important;
}
html[theme="light"] .v-card {
  background: linear-gradient(
      0deg,
      var(--light_background),
      var(--light_background)
    ),
    var(--light_text_color) !important;
}

.credit-card-add {
  font-size: 18px;
  width: 100%;
  height: 240px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  border: 1px solid;
  border-radius: 10px;
  cursor: pointer;
}
html[theme="light"] .credit-card-add {
  filter: drop-shadow(20px 20px 100px var(--light_drop_shadow));
  background: var(--light_background) !important;
}
html[theme="dark"] .credit-card-add {
  filter: drop-shadow(20px 20px 100px var(--dark_drop_shadow));
  background: var(--dark_background) !important;
}

html[theme="dark"] .success-btn {
  background: var(--primary) !important;
  border: solid 2px var(--primary) !important;
  color: white !important;
  border-radius: 10px;
  &:disabled {
    cursor: not-allowed;
    background: linear-gradient(
        0deg,
        var(--dark_disabled),
        var(--dark_disabled)
      ),
      var(--primary) !important;
    border: none !important;
  }
}
html[theme="light"] .success-btn {
  background: var(--primary) !important;
  border: solid 2px var(--primary) !important;
  color: white !important;
  border-radius: 10px;
  &:disabled {
    cursor: not-allowed;
    background: linear-gradient(
        0deg,
        var(--light_disabled),
        var(--light_disabled)
      ),
      var(--primary) !important;
    border: none !important;
  }
}

.paymentMethod {
  display: flex;
  justify-content: space-between;
  align-items: center;
  &_checkbox {
    position: relative;
    border: 1px solid;
    width: 45% !important;
  }
}
html[theme="light"] .paymentMethod {
  &_checkbox {
    background: var(--light_text_color);
    filter: drop-shadow(20px 20px 100px var(--light_drop_shadow));
    &_active > span > div > p,
    &_active > span > i {
      color: var(--light_text_color) !important;
    }
  }
}
html[theme="dark"] .paymentMethod {
  &_checkbox {
    background: var(--dark_text_color);
    filter: drop-shadow(20px 20px 100px var(--dark_drop_shadow));
    &_active > span > div > p,
    &_active > span > i {
      color: var(--light_text_color) !important;
    }
  }
}
</style>
