<template>
  <q-item
    :clickable="item.type === 'route'"
    :exact="item.exact"
    :to="item.to"
    class="q-py-none nav-item-wrapper"
  >
    <q-item-section avatar class="q-pr-none q-mr-none">
      <q-icon :name="item.icon" size="xs"></q-icon>
    </q-item-section>
    <q-item-section>
      <q-item-label :class="item.type === 'module' ? 'text-bold' : ''">{{
        item.title
      }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import Utils from "../../helpers/Utils";

export default {
  name: "MenuItem",
  props: ["item"],
  setup() {
    return {
      Utils,
    };
  },
};
</script>

<style></style>
