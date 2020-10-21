<template>
  <div id="app">
    <brainfuck-header></brainfuck-header>
    <brainfuck-engine></brainfuck-engine>
    <brainfuck-footer></brainfuck-footer>
  </div>
</template>

<script>
import BrainfuckHeader from "./components/BrainfuckHeader.vue";
import BrainfuckEngine from "./components/BrainfuckEngine.vue";
import BrainfuckFooter from "./components/BrainfuckFooter.vue";

export default {
  name: "app",
  components: {
    BrainfuckHeader,
    BrainfuckEngine,
    BrainfuckFooter,
  },
};
</script>

<style>
body {
  background: #eee;
}
#app {
  font-family: "Lato", "Noto Sans", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.code,
textarea,
input[type="text"] {
  font-family: "Source Code Pro", monospace;
}
</style>
