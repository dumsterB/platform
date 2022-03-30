<template>

</template>

<script>
export default {
  name: "index.vue",
  data(){
    return{
      currencies:[]
    }
  },
 async mounted(){
    let socket=global.socket
    await socket.send(`{

         }`)
  }
}
</script>

<style scoped>

</style>
