<template>
  <div>
    <p class="text-h6 font-weight-bold">{{ $t("verification") }}</p>
    <div>
      <v-list-item-group>
        <v-item-group>
          <v-container>
            <v-row>
              <v-col v-for="(item, i) in titles" :key="i" cols="12" md="6">
                <v-item v-slot="{ active, toggle }">
                  <v-card
                    :color="active ? 'primary--text' : ''"
                    dark
                    height="140"
                    @click="toggle"
                    class="px-4 py-6"
                  >
                    <v-scroll-y-transition>
                      <div v-if="active"></div>
                    </v-scroll-y-transition>
                    <div
                      :style="`background-image: url(${
                        imageData ? imageData : image_data
                      });`"
                      @click="toggle"
                    >
                      <label for="item.name">
                        <v-row
                          class="px-12 py-0 ma-0 mb-3 justify-center align-center"
                        >
                          <v-col :cols="2" class="pa-0 ma-0">
                            <v-icon size="32" color="icon_color">{{
                              item.icon
                            }}</v-icon>
                          </v-col>
                          <v-col :cols="10" class="pa-0 ma-0">
                            <p
                              class="icon_color--text text-uppercase upload_title"
                            >
                              {{ item.name }}
                            </p>
                          </v-col>
                        </v-row>

                        <p class="upload_lable">
                          {{ $t("drag_and_drop") }}
                        </p>
                        <input
                          class="file_input"
                          ref="fileInput"
                          type="file"
                          id="item.name"
                        />
                      </label>
                    </div>
                  </v-card>
                </v-item>
              </v-col>
            </v-row>
          </v-container>
        </v-item-group>
      </v-list-item-group>
    </div>
    <v-row class="mt-8">
      <v-col>
        <v-data-table
          :items="items"
          :headers="headers"
          class="elevation-1 ma-2"
          :style="customStyle"
          hide-default-footer
        >
          <template v-slot:top>
            <v-toolbar flat class="borderNone">
              <v-toolbar-title class="font-weight-bold">{{
                $t("list_uploaded_documents")
              }}</v-toolbar-title>
            </v-toolbar>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import config from "~/config/config.json";
export default {
  data() {
    return {
      primary: config.colors.text.primary,
      config: config,
      imageData: null,
      image_data: null,
      items: [],
    };
  },
  computed: {
    headers() {
      return [
        {
          text: this.$t("document"),
          value: "identifier",
          sortable: false,
        },
        {
          text: this.$t("time_uploaded"),
          value: "time uploaded",
          sortable: false,
        },
        {
          text: this.$t("time_processed"),
          value: "time processed",
          sortable: false,
        },
        {
          text: this.$t("status_title"),
          value: "status",
          sortable: false,
        },
      ];
    },
    titles() {
      return [
        {
          name: this.$t("proof_of_id"),
          value: this.$t("user_proof_of_id"),
          icon: "mdi-message-text-outline",
        },
        {
          name: this.$t("proof_of_residence"),
          value: this.$t("user_proof_of_residence"),
          icon: "mdi-file-document-multiple-outline",
        },
        {
          name: this.$t("back_of_credit_card"),
          value: this.$t("user_back_of_credit_card"),
          icon: "mdi-credit-card-outline",
        },
        {
          name: this.$t("proof_of_ID_back"),
          value: this.$t("user_proof_of_ID_back"),
          icon: "mdi-wallet-outline",
        },
        {
          name: this.$t("credit_card_front"),
          value: this.$t("user_credit_card_front"),
          icon: "mdi-card-account-details-outline",
        },
        {
          name: this.$t("your_selfie"),
          value: this.$t("user_your_selfie"),
          icon: "mdi-account-box-outline",
        },
      ];
    },
    customStyle() {
      return {
        "--primary": this.primary,
      };
    },
  },
  methods: {},
  mounted() {},
};
</script>

<style lang="scss">
.file_input {
  display: none;
}

.upload_title {
  cursor: pointer;
  font-size: 14px;
  line-height: 16px;
  letter-spacing: 0px;
}
.upload_lable {
  cursor: pointer;
  font-size: 14px;
  line-height: 16px;
  letter-spacing: 0px;
  display: flex;
  text-align: center;
  justify-content: center;
}
</style>
