<template>
  <div>
    <v-cantainer>
      <v-row>
        <v-col>
          <h2 class="ml-5 success_text--text">
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
                      <v-card-actions>
                        <p>
                          How are the prices calculated for the various
                          cryptocurrencies?
                        </p>
                        <v-spacer></v-spacer>
                        <v-btn icon @click="item.show = !item.show">
                          <v-icon>{{
                            item.show ? "mdi-chevron-up" : "mdi-chevron-down"
                          }}</v-icon>
                        </v-btn>
                      </v-card-actions>

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
                      <v-card-actions>
                        <p>
                          How are the prices calculated for the various
                          cryptocurrencies?
                        </p>

                        <v-spacer></v-spacer>

                        <v-btn icon @click="item.show = !item.show">
                          <v-icon>{{
                            item.show ? "mdi-chevron-up" : "mdi-chevron-down"
                          }}</v-icon>
                        </v-btn>
                      </v-card-actions>

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
      success_text: config.colors.text.primary,
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
};
</script>
