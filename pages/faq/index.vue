<template>
  <div class="pa-0 ma-0">
    <row class="d-flex justify-space-between align-center">
      <v-col :cols="1">
        <h2 class="text-uppercase font-weight-bold heading">
          {{ $t("faq") }}
        </h2>
      </v-col>
      <v-col :cols="4">
        <v-text-field
          class="global-search"
          :items="filtered"
          outlined
          dense
          hide-details
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          :label="$t('market_search_bar_placeholder')"
        ></v-text-field>
      </v-col>
    </row>
    <v-card class="mainBorderRadius">
      <v-row>
        <v-col :cols="3" class="px-8">
          <v-list width="100%" class="pa-0 borderNone">
            <v-list-item-group v-model="btn_active" class="d-flex">
              <v-list-item
                tag="button"
                block
                elevation="0"
                class="toggle_btn pa-0 text-none"
                :style="customStyle"
                active-class="active_toggle_btn"
                @click="personalHandler"
                >{{ $t("personal") }}</v-list-item
              >

              <v-list-item
                tag="button"
                block
                elevation="0"
                class="toggle_btn pa-0 text-none"
                :style="customStyle"
                active-class="active_toggle_btn"
                @click="businessHandler"
                >{{ $t("business") }}</v-list-item
              >
            </v-list-item-group>
          </v-list>
          <!-- -->
          <v-list width="100%" class="pa-0 borderNone">
            <v-list-item-group v-model="catecory_active">
              <div v-for="(item, i) in categories" :key="i">
                <v-list-item
                  :key="i"
                  nuxt
                  :style="customStyle"
                  class="font-weight-regular"
                  active-class="font-weight-bold"
                  @click="categoriesHandler(item.key)"
                >
                  <v-list-item-content>
                    <v-list-item-title v-text="$t(item.title)" />
                  </v-list-item-content>
                </v-list-item>
              </div>
            </v-list-item-group>
          </v-list>
        </v-col>
        <v-col :cols="4" class="mt-12">
          <v-expansion-panels>
            <v-expansion-panel
              v-model="search"
              class="mb-3"
              v-if="search ? search : !search"
              v-for="(item, i) in search ? searchable : filtered"
              :key="i"
              :value="0"
            >
              <v-hover v-slot="{ hover }" open-delay="223" close-delay="223">
                <v-expansion-panel-header
                  >{{ item.question }}
                  <template v-slot:actions>
                    <v-icon :color="hover ? 'primary' : 'success'"
                      >mdi-chevron-down</v-icon
                    >
                  </template>
                </v-expansion-panel-header>
              </v-hover>
              <v-expansion-panel-content>
                {{ item.answer }}
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
        <!-- 
        <v-col :cols="4" class="mt-12">
          <v-expansion-panels>
            <v-expansion-panel
              v-model="search"
              class="mb-3"
              v-if="search ? search : !search"
              v-for="(item, i) in search ? searchable : filtered"
              :key="i"
              :value="0"
            >
              <v-hover v-slot="{ hover }" open-delay="223" close-delay="223">
                <v-expansion-panel-header
                  >{{ item.question }}
                  <template v-slot:actions>
                    <v-icon :color="hover ? 'primary' : 'success'"
                      >mdi-chevron-down</v-icon
                    >
                  </template>
                </v-expansion-panel-header>
              </v-hover>
              <v-expansion-panel-content>
                {{ item.answer }}
              </v-expansion-panel-content>
            </v-expansion-panel>
            
          </v-expansion-panels>
        </v-col>
        -->
      </v-row>
    </v-card>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import config from "~/config/config.json";
export default {
  name: "faqPage",
  data() {
    return {
      start_gradient: config.themes.dark.start_gradient,
      end_gradient: config.themes.dark.end_gradient,
      primary: config.colors.text.primary,
      dark_item_bg: config.themes.dark.item_bg,
      light_item_bg: config.themes.light.item_bg,
      active_btn: "personal",
      active_catecory: "all",
      btn_active: 0,
      catecory_active: 0,
      config: config,
      search: null,
    };
  },
  methods: {
    personalHandler() {
      this.active_btn = "personal";
    },
    businessHandler() {
      this.active_btn = "business";
    },
    categoriesHandler(val) {
      this.active_catecory = val;
    },
  },
  computed: {
    ...mapGetters({
      categories: "config/categories/getAllCategories",
    }),
    ...mapGetters({
      questions: "config/faq/getAllFaq",
    }),
    customStyle() {
      return {
        "--start_gradient": this.start_gradient,
        "--end_gradient": this.end_gradient,
        "--primary": this.primary,
        "--dark_item_bg": this.dark_item_bg,
        "--light_item_bg": this.light_item_bg,
      };
    },
    filtered() {
      let data = [];
      let res = [];
      this.questions.map((el) => data.push(el));
      if (this.active_catecory === "all") {
        data.map((el) => res.push(el));
      } else if (this.active_catecory === "getting_started") {
        let cat = data.filter((el) => el.category === "getting_started");
        res.push(...cat);
      } else if (this.active_catecory === "what_is_arbitrage") {
        let cat = data.filter((el) => el.category === "what_is_arbitrage");
        res.push(...cat);
      } else if (this.active_catecory === "what_is_crypto") {
        let cat = data.filter((el) => el.category === "what_is_crypto");
        res.push(...cat);
      } else if (this.active_catecory === "what_is_leverage") {
        let cat = data.filter((el) => el.category === "what_is_leverage");
        res.push(...cat);
      } else if (this.active_catecory === "managing_my_account") {
        let cat = data.filter((el) => el.category === "managing_my_account");
        res.push(...cat);
      } else if (this.active_catecory === "trading_and_funding") {
        let cat = data.filter((el) => el.category === "trading_and_funding");
        res.push(...cat);
      } else if (this.active_catecory === "privacy_and_security") {
        let cat = data.filter((el) => el.category === "privacy_and_security");
        res.push(...cat);
      } else if (this.active_catecory === "create_an_account") {
        let cat = data.filter((el) => el.category === "create_an_account");
        res.push(...cat);
      }
      return res;
    },
    searchable() {
      let query = this.search;
      let fnd = this.filtered.filter(
        (el) => el.question.includes(query) || el.answer.includes(query)
      );
      return fnd;
    },
  },
  watch: {
    search(v) {
      let fnd = this.filtered.filter((el) => el.question.includes(v));
      return fnd;
    },
  },
};
</script>
<style lang="scss">
.heading {
  font-size: 32px;
  line-height: 38px;
}
.toggle_btn {
  padding: 10px 10px 10px 0px;
  justify-content: center;
  font-weight: 400;
  font-size: 18px;
  background: transparent !important;
  color: #bcbcbc !important;
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 22px;

  text-align: center;
}
.active_toggle_btn {
  position: relative;
  padding: 12px 0px 12px 0px;
  justify-content: center;
  font-weight: 700;
  font-size: 18px;
  line-height: 22px;
  background: transparent !important;
  color: var(--primary) !important;
}
.active_toggle_btn::after {
  position: absolute;
  content: "";
  width: 100%;
  min-height: 6px !important;
  top: 0px;
  left: 0;
  background: var(--primary) !important;
  border-radius: 0px 0px 4px 4px;
}
</style>
