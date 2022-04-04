<template>
  <div v-if="isLoading" :class="{ loader: true }">
    <v-progress-circular
      :size="70"
      :width="7"
      color="primary"
      indeterminate
    ></v-progress-circular>
  </div>
</template>

<script>
export default {
  name: "LoadingScreen",
  props: ["isLoading"],
};
</script>

<style lang="scss">
.loader {
  bottom: 0;
  display: block;
  font-size: 32px;
  left: 0;
  overflow: hidden;
  padding-top: 25vh;
  position: fixed;
  right: 0;
  text-align: center;
  top: 0;
}
</style>
