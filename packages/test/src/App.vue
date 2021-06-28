<template>
  <div id="app">
    <div :class="$style.div">111</div>
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";
console.log(process.env.VUE_APP_TEST);

export default {
  name: "App",
  components: {
    HelloWorld,
  },
};
</script>

<style lang="scss" module>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.div {
  color: red;
  font-size: 32px;
}
</style>
