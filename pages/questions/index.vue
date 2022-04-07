<template>
  <div>
    <v-cantainer>
      <v-row>
        <v-col>
          <h2 class="ml-5 gradient-text" :style="customStyle">
            {{ $t("frequently_asked_questions") }}
          </h2>
          <v-row class="pa-10">
            <v-col>
              <h3>{{ $t("general_questions") }}</h3>
              <div>
                <v-row class="mt-5">
                  <v-col cols="12">
                    <v-card
                      class="pa-2 mt-2"
                      v-for="(item, i) in items1"
                      :key="i"
                    >
                      <v-hover
                        v-slot="{ hover }"
                        open-delay="223"
                        close-delay="223"
                      >
                        <v-card-actions
                          :class="hover ? 'success_text--text' : ''"
                        >
                          <p>
                            How are the prices calculated for the various
                            cryptocurrencies?
                          </p>
                          <v-spacer></v-spacer>
                          <v-btn icon @click="item.show = !item.show">
                            <v-icon :color="hover ? 'primary' : 'icon_color'">{{
                              item.show ? "mdi-chevron-up" : "mdi-chevron-down"
                            }}</v-icon>
                          </v-btn>
                        </v-card-actions>
                      </v-hover>

                      <v-expand-transition>
                        <div v-show="item.show">
                          <v-divider></v-divider>

                          <v-card-text>
                            I'm a thing. But, like most politicians, he promised
                            more than he could deliver. You won't have time for
                            sleeping, soldier, not with all the bed making
                            you'll be doing. Then we'll go with that data file!
                            Hey, you add a one and two zeros to that or we walk!
                            You're going to do his laundry? I've got to find a
                            way to escape.
                          </v-card-text>
                        </div>
                      </v-expand-transition>
                    </v-card>
                  </v-col>
                </v-row>
              </div>
            </v-col>
            <v-col>
              <h3>{{ $t("other_information") }}</h3>
              <div>
                <v-row class="mt-5">
                  <v-col cols="12">
                    <v-card
                      class="pa-2 mt-2"
                      v-for="(item, i) in items"
                      :key="i"
                    >
                      <v-hover
                        v-slot="{ hover }"
                        open-delay="223"
                        close-delay="223"
                      >
                        <v-card-actions
                          :class="hover ? 'success_text--text' : ''"
                        >
                          <p>
                            How are the prices calculated for the various
                            cryptocurrencies?
                          </p>

                          <v-spacer></v-spacer>

                          <v-btn icon @click="item.show = !item.show">
                            <v-icon :color="hover ? 'primary' : 'icon_color'">{{
                              item.show ? "mdi-chevron-up" : "mdi-chevron-down"
                            }}</v-icon>
                          </v-btn>
                        </v-card-actions>
                      </v-hover>

                      <v-expand-transition>
                        <div v-show="item.show">
                          <v-divider></v-divider>
                          <v-card-text>
                            I'm a thing. But, like most politicians, he promised
                            more than he could deliver. You won't have time for
                            sleeping, soldier, not with all the bed making
                            you'll be doing. Then we'll go with that data file!
                            Hey, you add a one and two zeros to that or we walk!
                            You're going to do his laundry? I've got to find a
                            way to escape.
                          </v-card-text>
                        </div>
                      </v-expand-transition>
                    </v-card>
                  </v-col>
                </v-row>
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-cantainer>
  </div>
</template>
<script>
import config from "~/config/config.json";
export default {
  data() {
    return {
      start_gradient: config.themes.dark.start_gradient,
      end_gradient: config.themes.dark.end_gradient,
      show: false,
      items: [
        {
          show: false,
        },
        {
          show: false,
        },
        {
          show: false,
        },
        {
          show: false,
        },
        {
          show: false,
        },
        {
          show: false,
        },
        {
          show: false,
        },
        {
          show: false,
        },
      ],
      items1: [
        {
          show: false,
        },
        {
          show: false,
        },
        {
          show: false,
        },
        {
          show: false,
        },
        {
          show: false,
        },
        {
          show: false,
        },
        {
          show: false,
        },
        {
          show: false,
        },
      ],
    };
  },
  computed: {
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
.gradient-text {
  background: -webkit-linear-gradient(
    94.9deg,
    var(--start_gradient) 4.26%,
    var(--end_gradient) 95.87%
  );
  width: fit-content;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
