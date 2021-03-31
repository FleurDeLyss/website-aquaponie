<template>
  <div id="app">
    <Navbar />
    <router-view v-if="$store.state.loaded"/>
  </div>
</template>
<script>
import Navbar from "@/components/Navbar.vue";
export default {
  components: {
    Navbar
  }
}
</script>

<style lang="scss">
@import "@/main.scss";
</style>