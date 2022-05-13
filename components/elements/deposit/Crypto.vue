<template>
  <div class="pt-4">
    <div class="heading_selector mb-4">{{ $t("choose_crypto") }}:</div>
    <v-col cols="7" class="mb-10">
      <v-autocomplete
        v-model="buy_curr"
        :items="currencies"
        class="currency_selector"
        item-text="name"
        item-value="symbol"
        solo
        dense
        hide-details
        append-icon="mdi-chevron-down"
      >
        <template v-slot:selection="{ item }">
          <v-chip class="ma-3 pa-0" style="background: transparent !important">
            <v-row class="ma-0 pa-0">
              <img height="20" :src="item.logo" alt="" class="mr-2" />
              <strong>{{ item.name }}</strong>
              <span class="ml-2 icon_color--text font-weight-bold">
                {{ item.symbol }}</span
              >
            </v-row>
          </v-chip>
        </template>
        <template v-slot:item="{ item }">
          <div class="d-flex">
            <img height="20" :src="item.logo" alt="" />
            <div class="d-flex ml-3">
              <strong>{{ item.name }}</strong>
              <span class="ml-2 icon_color--text font-weight-bold">
                {{ item.symbol }}</span
              >
            </div>
          </div></template
        >
      </v-autocomplete>
    </v-col>
    <v-col cols="8" class="mb-10">
      <div class="heading_selector mb-4">QR {{ $t("code") }}:</div>
      <div class="qr_box pa-10">
        <v-img class="qr_img" :width="236" :src="img" />
      </div>
    </v-col>
    <v-col cols="10">
      <div class="heading_selector mb-4">{{ $t("deposit_adress") }}</div>
      <div class="depo">
        <v-text-field
          v-model="link_url"
          readonly
          outlined
          dense
          hide-details
          disabled
          class="depo_input"
        ></v-text-field>
        <v-icon
          class="depo_icon"
          color="primary"
          @click.prevent.stop="copyURL(link_url)"
          >{{ copied ? "mdi-check" : "mdi-content-copy" }}</v-icon
        >
      </div>
    </v-col>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import QRimg from "../../../assets/img/QR.png";
import config from "~/config/config.json";
const currencies = "data/currency";
export default {
  name: "Crypto",
  data() {
    return {
      currs: [],
      buy_curr: "BTC",
      img: QRimg,
      link_url: config.depo_adress,
      copied: false,
    };
  },
  computed: {
    ...mapGetters(currencies, {
      currencies_full: "list",
    }),
    currencies() {
      let c_f = this.currencies_full;
      return c_f.filter(
        (el) => el.currency_type && el.currency_type.key == "CRYPTO"
      );
    },
  },
  methods: {
    search_f() {
      let me = this;
      if (me.search) {
        me.f_currs = me.currs.filter((el) => {
          return (
            (el.name &&
              el.name.toLowerCase().includes(this.search.toLowerCase())) ||
            (el.symbol &&
              el.symbol.toLowerCase().includes(this.search.toLowerCase()))
          );
        });
      } else {
        me.f_currs = me.currs.slice(0, me.max_items);
      }
    },
    init_currs() {
      let me = this;
      let data = me.prices;
      let currs = me.currencies.map((el) => {
        let res = {
          id: el.id,
          symbol: el.symbol,
          name: el.name,
          logo: el.logo,
        };
        let fnd = data.find((e) => e && e.base == el.symbol);
        if (fnd) {
          res.price = fnd.price;
          res.change = fnd.change_24h;
          res.volume = fnd.volume_24h;
          res.change_p = (
            (parseFloat(fnd.change_24h) * 100) /
            parseFloat(fnd.price)
          ).toFixed(2);
        }
        return res;
      });
      let f_currs = currs.filter((el) => el.price);
      me.currs = f_currs;
      me.f_currs = f_currs.slice(0, me.max_items);
    },
    async copyURL(link) {
      try {
        await navigator.clipboard.writeText(link);
        this.copied = true;
        setTimeout(() => {
          this.copied = false;
        }, 1500);
      } catch (e) {
        console.log(e);
      }
    },
  },
  mounted() {},
};
</script>

<style lang="scss">
.currency_selector.theme--dark.v-text-field--solo
  > .v-input__control
  > .v-input__slot {
  background: #1c1838;
  border-radius: 10px !important;
  border: 1px solid #bcbcbc1a;
  box-shadow: none !important;
}

.currency_selector.theme--light.v-text-field--solo
  > .v-input__control
  > .v-input__slot {
  background: #ffffff;
  border-radius: 10px !important;
  border: none !important;
  box-shadow: none !important;
}

.heading_selector {
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
}
.qr_box {
  position: relative;
  background: linear-gradient(
      0deg,
      rgba(226, 226, 226, 0.3),
      rgba(226, 226, 226, 0.3)
    ),
    #ffffff;
  box-shadow: 20px 20px 100px rgba(0, 0, 0, 0.5);
  border-radius: 10px;
}
.qr_img {
}
html[theme="light"] {
  .qr_box {
    position: relative;
    background: linear-gradient(
        0deg,
        rgba(226, 226, 226, 0.3),
        rgba(226, 226, 226, 0.3)
      ),
      #ffffff;
    box-shadow: none;
    border-radius: 10px;
  }
}
.depo {
  position: relative;
  &_input {
    background: #161f49 !important;
    border: 1px transparent !important;
  }
  &_icon {
    position: absolute !important;
    content: "";
    top: 8px;
    right: 8px;
  }
}
</style>
