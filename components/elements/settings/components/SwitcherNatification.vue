<template>
<div>
  <p class="text-h6 mt-6">
    {{ $t("settings_notification") }}
  </p>
  <v-card style="width: 100%" height="150" class="pa-2">
  <p class="text-gray--text">
    {{ $t("settings_notification_description") }}
  </p>
    <div class="d-flex ml-2">
      <h2 class="mr-2 mt-3">ON</h2>
      <v-switch
          v-model="switcher"
          color="success"
      ></v-switch>
      <h2 class="ml-2 mt-3">OFF</h2>
    </div>

  </v-card>
</div>
</template>

<script>
export default {
  name: "SwitcherNatification",
  data(){
    return{
      switcher: "",
    }
  }
}
</script>

<style scoped>

</style>