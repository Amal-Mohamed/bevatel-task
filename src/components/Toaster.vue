<template>
  <div class="text-center">
    <v-snackbar
      v-model="active"
      top
      right
      transition="scale-transition"
      :color="status === 'success' ? 'green-darken-3' : 'red-darken-3'"
    >
      {{ message }}
      x
      <template v-slot:actions>
        <v-btn
          color="white"
          icon="mdi-close"
          size="small"
          @click="closeToaster"
        >
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from "vue";

export default defineComponent({
  props: {
    status: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  emits: ["close"],
  setup(props, { emit }) {
    const isActive = ref<boolean>(false);

    const closeToaster = () => {
      isActive.value = false;
      emit("close");
    };

    const active = computed({
      get: () => props.active,
      set: (value) => {
        isActive.value = value;
      },
    });

    // watch(
    //   () => props.active,
    //   (newValue) => {
    //     console.log("watch", newValue);
    //     isActive.value = newValue;
    //   }
    // );

    return {
      closeToaster,
      isActive,
      active,
    };
  },
});
</script>
