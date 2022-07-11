<template>
  <q-layout>
    <q-page class="login-page flex flex-center">
      <q-card
        flat
        :style="q.screen.gt.sm ? 'width: 30%' : 'width:90%'"
        class="q-pa-lg login-card"
      >
        <q-card-section class="text-center">
          <span class="text-h4 text-bold text-middle text-primary">{{
            currentForm == "login" ? "LOGIN" : "REGISTER"
          }}</span>
        </q-card-section>

        <template v-if="currentForm === 'login'">
          <q-form @submit.prevent="onLogin">
            <q-card-section class="q-mb-md">
              <q-input
                type="email"
                autofocus
                :disable="loading"
                outlined
                dense
                placeholder="Enter email"
                v-model="email"
                ref="emailInputRef"
                lazy-rules
                :rules="[(val) => (val && val.length) || 'Enter email']"
              >
                <template v-slot:prepend>
                  <q-icon name="fas fa-user" size="xs" />
                </template>
              </q-input>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <q-input
                :disable="loading"
                outlined
                dense
                :type="showPassword ? 'text' : 'password'"
                placeholder="Enter Password"
                v-model="password"
                ref="passwordInputRef"
                lazy-rules
                :rules="[(val) => (val && val.length) || 'Enter password']"
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

            <q-card-section>
              <q-btn
                type="submit"
                :disable="loading"
                :loading="loading"
                class="full-width"
                label="Login"
                color="primary"
                @click="onLogin"
              />
            </q-card-section>
          </q-form>
        </template>

        <template v-if="currentForm === 'register'">
          <q-form @submit.prevent="onRegister">
            <q-card-section class="q-mb-md">
              <q-input
                autofocus
                :disable="loading"
                outlined
                dense
                placeholder="Enter Name"
                v-model="formData.name"
                lazy-rules
                :rules="[(val) => val.length || 'Please enter name']"
              >
                <template v-slot:prepend>
                  <q-icon name="fas fa-user" size="xs" />
                </template>
              </q-input>
            </q-card-section>
            <q-card-section class="q-mb-md">
              <q-input
                type="email"
                autofocus
                :disable="loading"
                outlined
                dense
                placeholder="Enter Email"
                v-model="formData.email"
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
                v-model="formData.password"
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
                v-model="formData.password_confirmation"
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
              <q-space />
              <q-btn
                type="button"
                :disable="loading"
                :loading="loading"
                class=""
                label="Cancel"
                color="negative"
                @click="currentForm = 'login'"
              />
              <q-btn
                type="submit"
                :disable="loading"
                :loading="loading"
                class="q-ml-md"
                label="Register"
                color="primary"
                @click="onRegister"
              />
            </q-card-section>
          </q-form>
        </template>

        <q-card-section v-if="currentForm === 'login'" class="text-right">
          <a href="#" @click="currentForm = 'register'">Register</a>
        </q-card-section>
      </q-card>
    </q-page>
  </q-layout>
</template>

<script>
import { ref, reactive, inject, toRef } from "vue";
import { useRouter } from "vue-router";
import { api } from "../boot/axios";
import { useQuasar } from "quasar";
import Utils from "../helpers/Utils";
import useUser from "../composables/useUser";

export default {
  name: "Login",
  setup() {
    const auth = inject("auth");
    const $q = useQuasar();
    const router = useRouter();
    const { add } = useUser();
    const email = ref("");
    const password = ref("");
    const emailInputRef = ref(null);
    const passwordInputRef = ref(null);
    const showPassword = ref(false);
    const loading = ref(false);
    const currentForm = ref("login");
    const formData = reactive({
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    });

    async function onLogin() {
      emailInputRef.value.validate();
      passwordInputRef.value.validate();

      if (!emailInputRef.value.hasError && !passwordInputRef.value.hasError) {
        loading.value = true;

        try {
          await api.get("/sanctum/csrf-cookie");

          const response = await api.post("/auth/login", {
            email: email.value,
            password: password.value,
          });
          auth.setAuth(response.data);
          router.push("/");
          loading.value = false;
        } catch (err) {
          loading.value = false;
          let errorMessage = Utils.getErrorMessage(err);

          $q.notify({
            type: "negative",
            icon: "fas fa-exclamation-triangle",
            message: errorMessage,
          });
        }
      }
    }

    async function onRegister() {
      loading.value = true;

      try {
        const response = await add(formData);
        loading.value = false;
        currentForm.value = "login";
        $q.notify({
          type: "positive",
          icon: "fas fa-check",
          message: `Register successfully`,
        });
      } catch (err) {
        loading.value = false;
        let errorMessage = Utils.getErrorMessage(err);

        $q.notify({
          type: "negative",
          icon: "fas fa-exclamation-triangle",
          message: errorMessage,
        });
      }
    }

    return {
      q: $q,
      email,
      password,
      emailInputRef,
      passwordInputRef,
      showPassword,
      formData,
      loading,
      currentForm,
      onLogin,
      onRegister,
    };
  },
};
</script>

<style></style>
