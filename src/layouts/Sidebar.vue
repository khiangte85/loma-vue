<template>
  <q-drawer bordered>
    <div class="items-center row q-pa-md">
      <span class="text-h5 text-bold q-pl-md text-middle text-primary">
        LOMA
      </span>
    </div>
    <q-separator />
    <q-list>
      <template v-for="(item, i) in navItems">
        <template>
          <menu-item v-bind:key="`menu_item_${i}`" :item="item" />
          <q-separator v-bind:key="`menu_separator_${i}`" />
        </template>
      </template>
      <!-- Logout -->
      <q-item
        :clickable="true"
        class="q-py-none nav-item-wrapper"
        @click="onLogout"
      >
        <q-item-section avatar class="q-pr-none q-mr-none">
          <q-icon name="fas fa-power-off" size="xs"></q-icon>
        </q-item-section>
        <q-item-section>
          <q-item-label>Logout</q-item-label>
        </q-item-section>
      </q-item>
      <q-separator />
    </q-list>
  </q-drawer>
</template>

<script>
import { inject } from "vue";
import { useRouter } from "vue-router";
import Utils from "../helpers/Utils";
import navItems from "./navItems";
import MenuItem from "../components/Menu/MenuItem.vue";

export default {
  name: "Sidebar",
  components: {
    MenuItem,
  },
  setup() {
    const auth = inject("auth");
    const router = useRouter();

    async function onLogout() {
      try {
        await auth.logout();
        router.push("/auth/login");
      } catch (err) {
        router.push("/auth/login");
      }
    }

    return {
      navItems,
      Utils,
      onLogout,
    };
  },
};
</script>

<style></style>
