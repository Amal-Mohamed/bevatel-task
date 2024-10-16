/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from "@/plugins";
import "@/styles/main.css";
import store from "./store";
import { createVuetify } from "vuetify";
const vuetify = createVuetify();
// Components
import App from "./App.vue";

import { createApp } from "vue";

const app = createApp(App).use(vuetify).use(store);

registerPlugins(app);

app.mount("#app");
