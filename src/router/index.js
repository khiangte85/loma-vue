import { route } from "quasar/wrappers";
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import routes from "./routes";
import auth from "../store/auth";

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === "history"
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(
      process.env.MODE === "ssr" ? void 0 : process.env.VUE_ROUTER_BASE
    ),
  });

  Router.beforeEach(async (to, from, next) => {
    let loggedIn = auth.state.loggedIn;

    // console.log('Before each ' + loggedIn)

    if (to.name === "auth.login" && loggedIn) {
      next("/");
    }

    if (
      to.matched.some((record) => record.meta.requiresAuth) &&
      to.name !== "auth.login" &&
      !loggedIn
    ) {
      // this route requires auth, check if logged in
      // if not, redirect to login page.
      next("/auth/login");
    } else {
      next(); // make sure to always call next()!
    }
  });

  return Router;
});
