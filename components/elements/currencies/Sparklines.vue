<template>
<div>
  <v-sparkline
      :value="value"
      color="#BA68C8"
      height="100"
      padding="10"
      stroke-linecap="round"
      smooth
  >
  </v-sparkline>
</div>
</template>

<script>
export default {
  name: "Sparklines",
  data(){
    return{
      value: [
        423,
        446,
        975,
        510,
        990,
        610,
        860,
      ]
    }
  }
}
</script>

<style scoped>

</style>