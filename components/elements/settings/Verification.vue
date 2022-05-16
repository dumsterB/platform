<template>
  <div>
    <p class="text-h6 font-weight-bold">{{ $t("verification") }}</p>
    <div>
      <v-list-item-group>
        <v-item-group>
          <v-container>
            <v-row>
              <v-col
                v-for="(item, i) in titles"
                :key="i"
                cols="12"
                md="6"
                @click="check_click(item)"
              >
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
                      :style="`background-size: cover; height: 100%;
                        background-position: center center; background-image: url(${
                          item.img ? item.img : ''
                        });`"
                      @click="toggle"
                    >
                      <label for="item.name">
                        <v-row
                          v-if="!item.img"
                          class="pr-xs-12 pl-xs-12 pr-sm-12 pl-sm-12 pr-md-0 pl-md-0 pr-xl-12 pl-xl-12 py-0 ma-0 mb-3 justify-center align-center"
                        >
                          <v-col cols="2" class="pa-0 ma-0">
                            <v-icon size="32" color="icon_color">{{
                              item.icon
                            }}</v-icon>
                          </v-col>
                          <v-col cols="10" class="pa-0 ma-0">
                            <p
                              class="icon_color--text text-caption text-lg-overline font-h1 font-md-caption upload_title ma-0 pa-0"
                            >
                              {{ item.name }}
                            </p>
                          </v-col>
                        </v-row>

                        <p v-if="!item.img" class="upload_lable">
                          {{ $t("drag_and_drop") }}
                        </p>
                        <input
                          class="file_input"
                          :ref="`fileInput${item.document_type_id}`"
                          type="file"
                          id="item.name"
                          accept="image/*"
                          @input="onSelectFile"
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
          :items="approve_documents"
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
import { mapGetters, mapActions } from "vuex";
import config from "~/config/config.json";
export default {
  data() {
    return {
      primary: config.colors.text.primary,
      config: config,
      imageData: null,
      image_data: null,
      formData: null,
      current_doc: null,
      holder: false,
    };
  },
  computed: {
    ...mapGetters("data/documents_type", {
      documents_type: "list",
    }),
    ...mapGetters("data/approve_documents", {
      approve_documents: "list",
    }),
    headers() {
      return [
        {
          text: this.$t("document"),
          value: "document_type.name",
          sortable: false,
        },
        {
          text: this.$t("time_uploaded"),
          value: "updated_at",
          sortable: false,
        },
        {
          text: this.$t("status_title"),
          value: "status_documents.name",
          sortable: false,
        },
      ];
    },
    titles() {
      let f1 = this.approve_documents.find((el) => el.document_type_id == 1);
      let f2 = this.approve_documents.find((el) => el.document_type_id == 2);
      let f3 = this.approve_documents.find((el) => el.document_type_id == 3);
      let f4 = this.approve_documents.find((el) => el.document_type_id == 4);
      let f5 = this.approve_documents.find((el) => el.document_type_id == 5);
      let f6 = this.approve_documents.find((el) => el.document_type_id == 6);
      return [
        {
          name: this.$t("proof_of_id"),
          value: this.$t("user_proof_of_id"),
          icon: "mdi-message-text-outline",
          document_type_id: 1,
          img:
            f1 && f1.fs && f1.fs[0]
              ? `${this.$env("FILE_SERVER_BASE")}${f1.fs[0].dir}`
              : "",
        },
        {
          name: this.$t("proof_of_residence"),
          value: this.$t("user_proof_of_residence"),
          icon: "mdi-file-document-multiple-outline",
          document_type_id: 3,
          img:
            f3 && f3.fs && f3.fs[0]
              ? `${this.$env("FILE_SERVER_BASE")}${f3.fs[0].dir}`
              : "",
        },
        {
          name: this.$t("back_of_credit_card"),
          value: this.$t("user_back_of_credit_card"),
          icon: "mdi-credit-card-outline",
          document_type_id: 5,
          img:
            f5 && f5.fs && f5.fs[0]
              ? `${this.$env("FILE_SERVER_BASE")}${f5.fs[0].dir}`
              : "",
        },
        {
          name: this.$t("proof_of_ID_back"),
          value: this.$t("user_proof_of_ID_back"),
          icon: "mdi-wallet-outline",
          document_type_id: 2,
          img:
            f2 && f2.fs && f2.fs[0]
              ? `${this.$env("FILE_SERVER_BASE")}${f2.fs[0].dir}`
              : "",
        },
        {
          name: this.$t("credit_card_front"),
          value: this.$t("user_credit_card_front"),
          icon: "mdi-card-account-details-outline",
          document_type_id: 4,
          img:
            f4 && f4.fs && f4.fs[0]
              ? `${this.$env("FILE_SERVER_BASE")}${f4.fs[0].dir}`
              : "",
        },
        {
          name: this.$t("your_selfie"),
          value: this.$t("user_your_selfie"),
          icon: "mdi-account-box-outline",
          document_type_id: 6,
          img:
            f6 && f6.fs && f6.fs[0]
              ? `${this.$env("FILE_SERVER_BASE")}${f6.fs[0].dir}`
              : "",
        },
      ];
    },
    customStyle() {
      return {
        "--primary": this.primary,
      };
    },
  },
  methods: {
    ...mapActions("data/documents_type", {
      fetch_documents_type: "fetchList",
    }),
    ...mapActions("data/approve_documents", {
      fetch_approve_documents: "fetchList",
      create_document: "create",
    }),
    check_click(item) {
      if (!this.holder) {
        this.holder = true;
        this.current_doc = item.document_type_id;
        console.log("item", item);
        setTimeout(() => {
          this.holder = false;
        }, 100);
      }
    },
    async onSelectFile() {
      const input = this.$refs[`fileInput1`];
      console.log(this.$refs);
      const files = input[0].files;
      if (files && files[0]) {
        this.formData = new FormData();
        this.formData.append("file", files[0]);
        let fnd = this.approve_documents.find(
          (el) => el.document_type_id == this.current_doc
        );
        let id = null;
        if (fnd) {
          id = fnd.id;
        } else {
          let cr_doc = {
            document_type_id: this.current_doc,
            status_documents_id: 1,
            user_platform_id: this.$auth.user.id,
          };
          let rs = await this.create_document({ data: cr_doc });
          if (rs.data) {
            id = rs.data.id;
          }
        }
        let rs1 = await this.$axios
          .post(`/api/platform/approve_documents/${id}/img`, this.formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((rsp) => {
            // console.log("FILE SAVE RESP", rsp);
          })
          .catch(function (e) {
            console.log("== == !! UPLOAD FAIL", e);
            return;
          });

        await this.fetch_approve_documents();
      }
    },
  },
  async created() {
    await this.fetch_documents_type();
    await this.fetch_approve_documents();
    console.log("this.documents_type", this.documents_type);
  },
  mounted() {},
};
</script>

<style lang="scss">
.file_input {
  display: none;
}

.upload_title,
.v-application,
.text-lg-overline {
  cursor: pointer;
  font-size: 14px !important;
  line-height: 16px !important;
  letter-spacing: 0px !important;
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
