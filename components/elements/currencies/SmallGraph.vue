<template>
  <div>
    <v-sparkline
      :value="value"
      color="#BA68C8"
      :height="height"
      padding="10"
      stroke-linecap="round"
      :smooth="10"
    >
    </v-sparkline>
  </div>
</template>

<script>
export default {
  name: "Sparklines",
  props: {
    height: {
      type: Number,
      default: 100,
    },
  },
  data() {
    return {
      value: [333, 446, 975, 510, 990, 610, 860],
    };
  },
};
</script>

<style scoped>
</style>