<template>
  <v-navigation-drawer
    app
    v-model="drawer"
    :permanent="permanent"
    :mini-variant="style_panel_left_minimal"
    mobile-breakpoint="1"
    mini-variant-width="75"
    width="280"
    elevation="0"
  >
    <div
      v-if="style_panel_left_minimal"
      class="logo d-flex align-center justify-start px-4"
    ></div>

    <div
      v-if="!style_panel_left_minimal"
      class="panel_left_minimal d-flex align-center justify-start px-4"
    ></div>

    <div
      v-if="style_panel_left_minimal"
      class="d-flex align-center px-4"
      style="height: 70px; margin: 0px"
    >
      <v-hover v-slot="{ hover }" open-delay="223" close-delay="223">
        <v-btn
          icon
          :color="hover ? 'primary' : 'icon_color'"
          class="mx-auto"
          @click.stop="style_panel_left_minimal = !style_panel_left_minimal"
        >
          <v-icon size="28">{{ "mdi-menu" }}</v-icon>
        </v-btn>
      </v-hover>
    </div>

    <v-row
      v-if="!style_panel_left_minimal"
      class="align-center px-4"
      style="height: 70px; margin: 0px"
    >
      <img class="logo-img" :src="config.logo" :alt="$t('logoPic')" />
      <v-hover v-slot="{ hover }" open-delay="223" close-delay="223">
        <v-btn
          icon
          :color="hover ? 'primary' : 'icon_color'"
          :v-ripple="{ center: false }"
          class="ml-auto"
          @click.stop="style_panel_left_minimal = !style_panel_left_minimal"
        >
          <v-icon size="28">{{ "mdi-chevron-left" }}</v-icon>
        </v-btn>
      </v-hover>
    </v-row>

    <v-list class="ma-0 pa-0">
      <v-list-item-group v-model="menu_active">
        <div v-for="(item, i) in menu" :key="i">
          <v-list-item
            :key="i"
            nuxt
            :to="item.to"
            class="menu-list-item"
            active-class="success_text--text active-list-item"
          >
            <template v-slot:default="{}">
              <v-tooltip
                right
                nudge-right
                transition="slide-x-reverse-transition"
              >
                <template v-slot:activator="{ on }">
                  <v-list-item-action v-on="on">
                    <v-hover
                      v-slot="{ hover }"
                      open-delay="223"
                      close-delay="223"
                    >
                      <v-icon
                        :color="hover ? 'primary' : 'icon_color'"
                        size="24"
                        >{{ item.icon }}</v-icon
                      >
                    </v-hover>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-hover open-delay="223" close-delay="223">
                      <v-list-item-title
                        class="font-weight-medium"
                        v-text="$t(item.title)"
                      />
                    </v-hover>
                  </v-list-item-content>
                </template>
                <span>{{ $t(item.title) }}</span>
              </v-tooltip>
            </template>
          </v-list-item>
        </div>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import config from "~/config/config.json";
export default {
  data: function () {
    return {
      icon_color: config.colors.icon_color,
      style_panel_left_minimal: false,
      permanent: true,
      menu_active: 0,
      drawer: true,
      config: config,
    };
  },
  components: {},
  methods: {},

  computed: {
    ...mapGetters({
      menu: "config/menu/getAllMenu",
    }),
  },
  mounted() {},
  watch: {},
};
</script>
<style>
.v-navigation-drawer__border {
  display: none;
}
.active-list-item::before {
  background: transparent;
}
.active-list-item .v-list-item__title {
  font-size: 18px !important;
}
.menu-list-item .v-list-item__title {
  font-size: 15px;
}
.menu-list-item .v-icon {
  margin-left: 20px;
}
.v-navigation-drawer--mini-variant .menu-list-item .v-icon {
  margin-left: 0px;
}
.logo-img {
  height: 30px;
  margin-right: auto;
  margin-left: 20px;
}
</style>
