import { reactive, readonly } from "vue";
import { api } from "../../boot/axios";

const state = reactive({
  loggedIn: false,
  user: null,
});

function setAuth(data) {
  state.loggedIn = true;
  state.user = data.user;
}

async function checkAuth() {
  try {
    const response = await api.get("/auth/user");
    setAuth(response.data);
  } catch (err) {
    await logout();
  }
}

async function logout() {
  try {
    state.loggedIn = false;
    state.user = null;
    await api.post("/auth/logout");
  } catch (err) {
    // Force redirect
    window.location = "/#/auth/login";
  }
}

export default {
  state: readonly(state),
  setAuth,
  checkAuth,
  logout,
};
