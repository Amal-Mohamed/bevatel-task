/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from "@/plugins";
import "@/styles/main.css";
import store from "./store";

// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";

const app = createApp(App).use(store);

registerPlugins(app);

app.mount("#app");
