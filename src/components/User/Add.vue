<template>
  <q-card :style="q.platform.is.mobile ? 'width: 100%' : 'width: 600px'">
    <q-bar dark class="bg-primary text-white">
      <span class="text-body2">Add User</span>
      <q-space />
      <q-btn
        dense
        flat
        icon="fas fa-times"
        @click="context.emit('onClose')"
        :disable="saving"
      >
        <q-tooltip>Close</q-tooltip>
      </q-btn>
    </q-bar>
    <q-form @submit.prevent.stop="onSubmit">
      <q-card-section class="q-pt-lg">
        <q-input
          autofocus
          :disable="loading"
          outlined
          dense
          placeholder="Enter Name"
          v-model="name"
          lazy-rules
          :rules="[(val) => val.length || 'Please enter name']"
        >
          <template v-slot:prepend>
            <q-icon name="fas fa-user" size="xs" />
          </template>
        </q-input>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input
          type="email"
          autofocus
          :disable="loading"
          outlined
          dense
          placeholder="Enter Email"
          v-model="email"
          lazy-rules
          :rules="[(val) => val.length || 'Please enter email']"
        >
          <template v-slot:prepend>
            <q-icon name="fas fa-envelope" size="xs" />
          </template>
        </q-input>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input
          :type="showPassword ? 'text' : 'password'"
          v-model="password"
          label="Password"
          dense
          outlined
          lazy-rules
          :rules="[(val) => val.length || 'Please enter  password']"
        >
          <template v-slot:prepend>
            <q-icon name="fas fa-key" size="xs" />
          </template>
          <template v-slot:append>
            <q-icon
              :name="showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'"
              size="xs"
              @click="showPassword = !showPassword"
            />
          </template>
        </q-input>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input
          :type="showPassword ? 'text' : 'password'"
          v-model="password_confirmation"
          label="Confirm Password"
          dense
          outlined
          lazy-rules
          :rules="[(val) => val.length || 'Please confirm new password']"
        >
          <template v-slot:prepend>
            <q-icon name="fas fa-key" size="xs" />
          </template>
          <template v-slot:append>
            <q-icon
              :name="showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'"
              size="xs"
              @click="showPassword = !showPassword"
            />
          </template>
        </q-input>
      </q-card-section>

      <q-card-section class="text-right">
        <q-btn
          flat
          color="negative"
          class="q-px-md"
          @click="context.emit('onClose')"
          :disable="saving"
          >Cancel</q-btn
        >
        <q-btn
          color="accent"
          class="q-px-md q-ml-md"
          @click="onSubmit"
          :disable="saving"
          >Save</q-btn
        >
      </q-card-section>
    </q-form>
  </q-card>
</template>

<script>
import { ref, toRefs, reactive } from "vue";
import { useQuasar } from "quasar";
import useUser from "../../composables/useUser";

export default {
  setup(props, context) {
    const $q = useQuasar();
    const { saving, add } = useUser();
    const showPassword = ref(false);
    const item = reactive({
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    });

    async function onSubmit() {
      try {
        await add({ ...item });
        context.emit("onAdded");
        $q.notify({
          type: "positive",
          icon: "fas fa-check",
          message: `User added successfully`,
        });
      } catch (err) {
        $q.notify({
          type: "negative",
          icon: "fas fa-exclamation-triangle",
          message: err.toString(),
        });
      }
    }

    return {
      q: $q,
      context,
      saving,
      showPassword,
      ...toRefs(item),
      onSubmit,
    };
  },
};
</script>

<style></style>
