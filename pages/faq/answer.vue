<template>
  <v-container>
    <v-row style="height: 60vh">
      <v-col :cols="1" class="d-flex justify-space-between align-start">
        <v-hover v-slot="{ hover }" open-delay="223" close-delay="223">
          <v-icon
            @click="goBack"
            tag="button"
            :color="hover ? 'success' : 'primary'"
            >mdi-arrow-left
          </v-icon>
        </v-hover>
      </v-col>
      <v-col :cols="11">
        <h2 class="mb-8">{{ item.question }}</h2>
        <div>{{ item.answer }}</div>
      </v-col>
    </v-row>
    <!-- -->
    <v-container>
      <h4>{{ $t("similar_questions") }}</h4>
      <v-row>
        <v-col :cols="6" class="mt-12">
          <v-expansion-panels>
            <v-expansion-panel
              v-model="search"
              class="mb-3"
              v-if="search ? search : !search"
              v-for="(item, i) in firstHalfІimilarQuestions"
              :key="i"
              :value="0"
              @click="showAnswer(item)"
            >
              <v-expansion-panel-header hide-actions
                >{{ item.question }}
              </v-expansion-panel-header>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>

        <v-col :cols="6" class="mt-12">
          <v-expansion-panels>
            <v-expansion-panel
              v-model="search"
              class="mb-3"
              v-for="(item, i) in secondHalfІimilarQuestions"
              :key="i"
              :value="0"
              @click="showAnswer(item)"
            >
              <v-expansion-panel-header hide-actions
                >{{ item.question }}
              </v-expansion-panel-header>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import config from "~/config/config.json";
export default {
  name: "Answer",
  data() {
    return {
      config: config,
    };
  },
  props: {
    item: {
      type: Object,
      default: () => {
        return {};
      },
    },
    goBack: {
      type: Function,
      default: () => {
        return {};
      },
    },
    showAnswer: {
      type: Function,
      default: () => {
        return {};
      },
    },
  },
  computed: {
    ...mapGetters({
      questions: "config/faq/getAllFaq",
    }),
    similarQuestions() {
      let similar = [];
      let filtredQuestions = this.questions.filter(
        (item) => item.category === this.item.category
      );
      similar.push(...filtredQuestions);
      return similar;
    },
    firstHalfІimilarQuestions() {
      const items = this.similarQuestions;
      let half = Math.ceil(items.length / 2);
      let first = items.slice(0, half);
      return first;
    },
    secondHalfІimilarQuestions() {
      const items = this.similarQuestions;
      let half = Math.ceil(items.length / 2);
      let second = items.slice(half);
      return second;
    },
  },
  mounted() {},
};
</script>
