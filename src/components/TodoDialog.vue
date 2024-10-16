<template>
  <div class="text-center pa-4">
    <v-dialog v-model="active" width="800">
      <v-card prepend-icon="mdi-update" title="Update Todo">
        <v-form class="pa-6" v-model="valid" ref="form">
          <v-text-field
            v-model="data.task"
            label="Task*"
            required
            variant="outlined"
            :rules="titleRules"
            class="mb-1"
          />
          <v-text-field
            v-model="data.content"
            label="Content"
            required
            variant="outlined"
            class="mb-1"
          />

          <v-select
            color="green"
            v-model="data.status"
            :rules="statusRules"
            label="Status"
            required
            variant="outlined"
            :items="['todo', 'in progress', 'done']"
          >
          </v-select>

          <div class="d-flex justify-space-between">
            <v-btn
              width="150"
              height="50"
              @click="closeDialog"
              variant="tonal"
              color="green"
              >Cancel</v-btn
            >
            <v-btn
              width="150"
              height="50"
              @click="updateTodo"
              color="green"
              :disabled="!valid"
              >Update</v-btn
            >
          </div>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from "vue";
import { TodoItemType } from "@/types/todo-item";
// import { useField, useForm } from "vee-validate";

export default defineComponent({
  props: {
    active: {
      type: Boolean,
      required: true,
    },
    data: {
      type: Object as () => TodoItemType,
      required: true,
    },
  },
  emits: ["close", "update"],
  setup(props, { emit }) {
    const isActive = ref<boolean>(false);
    const taskStatus = ref(props.data.status);
    const titleRules = [
      (v: string) => !!v || "Title is required",
      (v: string) =>
        (v && v.length <= 50) || "Title must be less than 50 characters",
    ];
    const statusRules = [(v: string) => !!v || "Status is required"];
    const valid = ref(false);

    const closeDialog = () => {
      emit("close");
    };
    const updateTodo = () => {
      console.log("updateTodo", props.data);
      emit("update", props.data);
    };

    const active = computed({
      get: () => props.active,
      set: (value) => {
        isActive.value = value;
      },
    });

    // watch(
    //   () => props.data.status,
    //   (newStatus) => {
    //     taskStatus.value = newStatus;
    //   }
    // );

    return {
      closeDialog,
      updateTodo,
      isActive,
      active,
      taskStatus,
      titleRules,
      valid,
      statusRules,
    };
  },
});
</script>
