<template>
  <v-navigation-drawer
      v-model="drawerMenu"
      app
     style="background: #1C1838!important;"
  >
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
            class="ml-auto"
            @click="drawerHandler"
        >
          <v-icon size="28">{{ "mdi-chevron-left" }}</v-icon>
        </v-btn>
      </v-hover>
    </v-row>
    <v-list class="ma-0 pa-0 mt-5">
      <v-list-item-group v-model="menu_active">
        <div v-for="(item, i) in menu" :key="i">
          <v-list-item
              :key="i"
              nuxt
              :to="item.to"
              :style="customStyle"
              class="menu-list-item primary--text"
              active-class="active-list-item"
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
                    <v-list-item-title v-text="$t(item.title)" />
                  </v-list-item-content>
                </template>
                <span>{{ $t(item.title) }} </span>
              </v-tooltip>
            </template>
          </v-list-item>
        </div>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import {mapGetters, mapActions, mapState, mapMutations} from "vuex";
import config from "~/config/config.json";
export default {
  data: function () {
    return {
      icon_color: config.colors.icon_color,
      primary: config.themes.dark.primary,
      style_panel_left_minimal: false,
      permanent: true,
      menu_active: 0,
      config: config,
    };
  },
  components: {},
  methods: {
    ...mapMutations({setDrawer:'config/data/setDrawer'}),
    drawerHandler(){
      this.setDrawer(false)
      console.log('works')
    },
  },

  computed: {
    ...mapGetters({
      menu: "config/menu/getAllMenu",
      drawerMenu:"config/data/drawerMenu"
    }),
    customStyle() {
      return {
        "--primary": this.primary,
      };
    },

  },
  mounted() {},
  watch: {},
};
</script>
<style lang="scss">
.v-navigation-drawer__border {
  display: none;
}
.active-list-item {
  position: relative;
}
.active-list-item::after {
  position: absolute;
  content: "";
  height: 100%;
  width: 8px;
  background: var(--primary) !important;
  left: 0;
  border-radius: 0px 5px 5px 0px;
}
.active-list-item::before {
  background: transparent;
}
.active-list-item .v-list-item__title {
  font-size: 16px !important;
  font-weight: 600 !important;
  color: var(--primary) !important;
}
.active-list-item > div > .icon_color--text {
  color: var(--primary) !important;
}
.menu-list-item .v-list-item__title {
  font-size: 14px;
  font-weight: 400;
  color: #848484;
}
.menu-list-item .v-icon {
  margin-left: 20px;
  color: #848484;
}
html[theme="dark"] {
  .active-list-item .v-list-item__title {
    color: white !important;
  }
  .active-list-item > div > .icon_color--text {
    color: white !important;
  }
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
