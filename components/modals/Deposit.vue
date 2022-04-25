<template>
  <div>
    <v-dialog id="dialog" v-model="dialog" width="600" persistent>
      <v-card class="pl-12 pr-12 pt-8 pb-12">
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
          <v-container fluid class="paymentMethod ma-0 pa-0">
            <v-bottom-navigation
              height="100"
              v-model="selectedPaymentMethod"
              class="justify-space-between"
            >
              <v-btn
                value="bankCard"
                class="paymentMethod_checkbox rounded-xl pl-8 pr-8"
                activeClass="primary"
              >
                <v-icon class="mr-4">mdi-credit-card-multiple-outline</v-icon>
                <div class="d-flex flex-wrap align-center">
                  <p class="mr-4 mb-0 font-weight-bold">Bank Card</p>
                  <p class="mb-0 font-weight-thin">1.2% {{ $t("fee") }}</p>
                </div>
              </v-btn>
              <v-btn
                value="crypto"
                class="paymentMethod_checkbox rounded-xl pl-8 pr-8"
                activeClass="primary"
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
        <v-list flat>
          <v-list-item v-for="(item, i) in items" :key="i">
            <v-list-item-content class="pb-2 pt-2">
              <v-btn
                large
                :class="i == selected_card ? 'success-btn' : ''"
                :style="customStyle"
                @click="selected_card = i"
              >
                <img
                  v-if="item.card_icon"
                  class="card_input__icon mr-2"
                  width="24"
                  height="24"
                  :src="item.card_icon"
                  alt=""
                />
                <v-icon class="mr-2" v-else>mdi-credit-card-outline</v-icon>
                {{ item ? item.card_number : "" }}
                <v-icon
                  style="position: absolute; right: 20px"
                  @click="delete_card(item)"
                  >mdi-close</v-icon
                >
              </v-btn>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <div v-if="items.length === 0" class="text-center">
          <div class="d-block">
            <div class="credit-card-add item_bg" @click="cardDialogChanger">
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
        <v-row v-if="items.length > 0" class="mt-4 pa-4">
          <v-col cols="12" sm="12" md="12">
            <v-text-field
              v-model="enteredMoney"
              outlined
              :label="$t('enter_your_amount')"
              type="number"
              :error-messages="err_m"
            ></v-text-field>
            <p class="text-gray--text">{{ $t("deposit_ruls") }}</p>
          </v-col>
        </v-row>
        <v-card-actions v-if="items.length > 0">
          {{ $t("pay") }}: {{ enteredMoney }} {{ curr }}
          <v-spacer></v-spacer>
          <v-btn
            large
            dark
            class="success-btn"
            :style="customStyle"
            text
            :disabled="selected_card < 0"
            :loading="loading"
            @click="make_order"
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
      selectedItem: 1,
      cardDialog: false,
      enteredMoney: "",
      items: [],
      selected_card: -1,
      loading: false,
      curr: "USD",
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
      if (this.selected_card > -1) {
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
        console.log("order_data", order_data);
        let rs = await this.order_create({ data: order_data });
        let title, color;
        if (rs.data && rs.data.order_status_id != 3) {
          title = this.$t("order_failed");
          color = "error";
        } else {
          title = this.$t("create_order_progress");
          color = "warning";
          setTimeout(() => {
            this.$store.commit("data/notifications/create", {
              id: color + "_" + Math.random().toString(36),
              title: this.$t("create_order_done"),
              text: this.$t("create_order_done"),
              color: "primary",
            });
          }, 2500);
        }
        this.$store.commit("data/notifications/create", {
          id: color + "_" + Math.random().toString(36),
          title: title,
          text: title,
          color: color,
          timeout: 2000,
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
html[theme="dark"] .v-card {
  background: #001935 !important;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.05) !important;
  border-radius: 35px !important;
}
html[theme="light"] .v-card {
  background: linear-gradient(
      0deg,
      rgba(226, 226, 226, 0.3),
      rgba(226, 226, 226, 0.3)
    ),
    #ffffff !important;
  border-radius: 35px !important;
}
.credit-card-add {
  font-size: 18px;
  width: 100%;
  height: 240px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  border: 1px solid;
  border-radius: 20px;
  cursor: pointer;
}
.success-btn {
  background: linear-gradient(
    94.9deg,
    var(--start_gradient) 4.26%,
    var(--end_gradient) 95.87%
  );
  color: white !important;
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

  .v-input__control .v-icon .mdi-checkbox-marked::before {
    content: "" !important;
  }

  i.mdi-checkbox-blank-outline::before {
    content: "" !important;
  }
}
</style>
