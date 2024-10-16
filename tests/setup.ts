// test/setup.ts
import { config } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import "vuetify/styles";
import { aliases, mdi } from "vuetify/iconsets/mdi";

// Setup Vuetify for testing
const vuetify = createVuetify({
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: { mdi },
  },
});

config.global.plugins = [vuetify];
