<template>
  <v-row class="ma-4">
    <v-col class="pl-4 mainBorderRadius" md="4" lg="2">
      <h3 style="font-weight: 400">{{ $t("general_questions") }}</h3>
      <v-list-item-group
        class="mt-4"
        dense
        v-model="selectedItem"
        active-class="primary--text"
      >
        <v-list-item dense v-for="(item, i) in categories" :key="i">
          <v-list-item-icon class="mr-0 pr-2">
            <v-icon v-text="item.icon"></v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title
              v-text="i != 0 ? item.text + ' ' + i : item.text"
            ></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-col>
    <v-col md="8" lg="7">
      <h2 class="gradient" :style="customStyle">
        {{ $t("user_help") }}
      </h2>
      <v-expansion-panels class="mt-4">
        <v-text-field
          class="mb-4"
          outlined
          dense
          hide-details
          v-model="search"
          append-icon="mdi-magnify"
          :label="$t('market_search_bar_placeholder')"
        ></v-text-field>
        <v-expansion-panel
          class="mb-3"
          v-for="(item, i) in help_items"
          :key="i"
        >
          <v-hover v-slot="{ hover }" open-delay="223" close-delay="223">
            <v-expansion-panel-header
              >{{ item.title }}
              <template v-slot:actions>
                <v-icon :color="hover ? 'primary' : 'success_text'"
                  >mdi-chevron-down</v-icon
                >
              </template>
            </v-expansion-panel-header>
          </v-hover>
          <v-expansion-panel-content>
            {{ item.text }}
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-col>
    <v-col md="12" lg="3">
      <v-list style="margin-top: 50px">
        <v-list-item v-for="(item, i) in tutorials" :key="i">
          <v-list-item-content class="pb-1 mb-2" style="cursor: pointer">
            <v-img class="mainBorderRadius" :src="item.img"></v-img>
            <v-list-item-title
              class="mt-2"
              v-text="item.title"
            ></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-col>
  </v-row>
</template>
<script>
import config from "~/config/config.json";
export default {
  data() {
    return {
      start_gradient: config.themes.dark.start_gradient,
      end_gradient: config.themes.dark.end_gradient,
      selectedItem: 0,
      search: "",
      count: 15,
      count_t: 8,
    };
  },
  computed: {
    categories() {
      return [
        {
          icon: "mdi-folder-outline",
          text: this.$t("all_time"),
        },
        {
          icon: "mdi-folder-outline",
          text: this.$t("category"),
        },
        {
          icon: "mdi-folder-outline",
          text: this.$t("category"),
        },
        {
          icon: "mdi-folder-outline",
          text: this.$t("category"),
        },
        {
          icon: "mdi-folder-outline",
          text: this.$t("category"),
        },
        {
          icon: "mdi-folder-outline",
          text: this.$t("category"),
        },
      ];
    },
    help_items() {
      let data = [];
      for (let i = 0; i < this.count; i++) {
        data.push({
          title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
          text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet,
            consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
            labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo
            consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit,
            sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
            nisi ut aliquip ex ea commodo consequat.`,
        });
      }
      return data;
    },
    tutorials() {
      let data = [];
      for (let i = 0; i < this.count_t; i++) {
        data.push({
          title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
          img: "https://platform.prof-investment.com/static/media/help.d8efb526.jpg",
        });
      }
      return data;
    },
    customStyle() {
      return {
        "--start_gradient": this.start_gradient,
        "--end_gradient": this.end_gradient,
      };
    },
  },
};
</script>
<style>
.rounded .v-list-item--link:before {
  border-radius: 10px;
}
.gradient {
  background: -webkit-linear-gradient(
    94.9deg,
    var(--start_gradient) 4.26%,
    var(--end_gradient) 95.87%
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0 auto;
  width: fit-content;
}
</style>
