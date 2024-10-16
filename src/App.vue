<template>
  <v-app>
    <v-container>
      <div class="todo-wrapper">
        <h2 v-if="todos && todos.length > 0">
          Todo List <v-chip color="green">{{ todos.length }}</v-chip>
        </h2>
        <TodoList />
      </div>
    </v-container>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useStore } from "vuex";
import TodoList from "./components/TodoItems.vue";

export default defineComponent({
  components: { TodoList },
  setup() {
    const store = useStore();
    const todos = computed(() => store.getters.getTodoList);

    return { todos };
  },
});
</script>

<style></style>
