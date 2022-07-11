<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="fas fa-bars"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title class="text-h6">
          {{ $route.meta.title }}
        </q-toolbar-title>

        <div class="q-pa-md q-gutter-sm" v-if="auth.state.loggedIn">
          <q-chip
            icon-right="fas fa-ellipsis-v"
            text-color="black"
            class="q-pa-md cursor-pointer"
            size="sm"
          >
            <span class="q-px-md" :style="{ fontSize: '13px' }">{{
              auth.state.user.name
            }}</span>
          </q-chip>
        </div>
      </q-toolbar>
    </q-header>

    <sidebar v-model="leftDrawerOpen" />
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import Utils from "../helpers/Utils";
import Sidebar from "./Sidebar.vue";
import { useRouter, useRoute } from "vue-router";
import { defineComponent, ref, inject } from "vue";

export default defineComponent({
  name: "Layout",
  components: {
    Sidebar,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const auth = inject("auth");
    const leftDrawerOpen = ref(true);

    function toggleLeftDrawer() {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    }

    async function onLogout() {
      try {
        await auth.logout();
        router.push("/auth/login");
      } catch (err) {
        router.push("/auth/login");
      }
    }

    return {
      auth,
      route,
      Utils,
      leftDrawerOpen,
      toggleLeftDrawer,
      onLogout,
    };
  },
});
</script>
