<template>
  <v-row class="ma-4">
    <v-col class="pl-4 rounded" md="4" lg="2">
      <h2 style="font-weight: 400">{{ $t("general_questions") }}</h2>
      <v-list-item-group
        class="mt-4"
        dense
        v-model="selectedItem"
        color="primary"
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
      <h2 class="primary--text" style="text-align: center">
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
          <v-expansion-panel-header>{{ item.title }}</v-expansion-panel-header>
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
            <v-img class="rounded-xl" :src="item.img"></v-img>
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
export default {
  data() {
    return {
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
  },
};
</script>
<style>
.rounded .v-list-item--link:before {
  border-radius: 10px;
}
</style>
