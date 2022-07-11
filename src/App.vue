<template>
  <router-view />
</template>
<script>
import { defineComponent, provide } from "vue";
import auth from "./store/auth";

export default defineComponent({
  name: "App",
  setup() {
    provide("auth", auth);
  },
});
</script>

