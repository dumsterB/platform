<template>
<div>
  <p class="text-h6 mb-4">
    {{ $t("settings_notification") }}
  </p>
  <v-card style="width: 100%" class="pa-6">
  <p class="text-gray--text" style="font-size: 14px">
    {{ $t("settings_notification_description") }}
  </p>
    <div class="d-flex ml-2">
      <h2 class="mr-2 mt-3">ON</h2>
      <v-switch
          v-model="switcher"
          color="success"
          hide-details
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