<template>
  <v-list-item
    :key="todo.id"
    class="todo-item"
    :class="{ 'completed-todo': todo.completed }"
  >
    <div>
      <v-list-item-title>
        {{ todo.task }}
      </v-list-item-title>
      <v-list-item-subtitle>
        {{ todo.content }}
      </v-list-item-subtitle>
      <v-chip
        :color="statusColor(todo.status)"
        variant="flat"
        size="small"
        class="mt-3"
      >
        {{ todo.status }}
      </v-chip>
    </div>

    <template v-slot:prepend>
      <v-checkbox
        v-model="todo.completed"
        color="green"
        hide-details
      ></v-checkbox>
    </template>

    <template v-slot:append>
      <v-menu offset-x activator="parent" transition="slide-y-transition">
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props" flat>
            <v-icon color="grey-lighten-1">mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <div class="actions-list">
          <v-btn
            block
            color="red-darken-1"
            prepend-icon="mdi-delete"
            @click="deleteTodo"
            variant="text"
          >
            <template v-slot:prepend>
              <v-icon color="red-darken-1"></v-icon>
            </template>
            Delete</v-btn
          >
          <v-btn
            block
            color="grey-darken-1"
            prepend-icon="mdi-pencil"
            @click="showEditMode"
            variant="text"
          >
            <template v-slot:prepend>
              <v-icon color="grey-darken-1"></v-icon> </template
            >Edit</v-btn
          >
        </div>
      </v-menu>
    </template>
  </v-list-item>
</template>

<script lang="ts">
import { defineComponent, watch } from "vue";
import { TodoItemType } from "@/types/todo-item";
import { ref, computed } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  props: {
    todo: {
      type: Object as () => TodoItemType,
      required: true,
    },
  },
  emits: ["delete", "update", "openDialog"],
  setup(props, { emit }) {
    const taskValue = ref<string>("");
    const editModeIsActive = ref<boolean>(false);
    const store = useStore();

    const taskText = computed({
      get: () => props.todo.task,
      set: (value) => {
        taskValue.value = value;
      },
    });

    const showEditMode = () => {
      // editModeIsActive.value = true;
      emit("openDialog", props.todo);
    };
    const updateTodo = () => {
      emit("update", {
        id: props.todo.id,
        task: taskValue.value,
      });
      editModeIsActive.value = false;
    };

    const statusColor = (status: string) => {
      switch (status) {
        case "todo":
          return "blue";
        case "in progress":
          return "orange";
        case "done":
          return "green";
        default:
          return "red";
      }
    };
    watch(
      () => props.todo.completed,
      (newStatus) => {
        store.dispatch("updateTodoItem", {
          ...props.todo,
          completed: newStatus,
          status: newStatus ? "done" : "todo",
        });
      }
    );

    return {
      taskValue,
      taskText,
      showEditMode,
      editModeIsActive,
      updateTodo,
      statusColor,
    };
  },
  methods: {
    deleteTodo() {
      this.$emit("delete", this.todo.id);
    },
  },
});
</script>

<style scoped></style>
