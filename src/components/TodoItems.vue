<template>
  <v-container>
    <v-form @submit.prevent="addTodo" class="todo-form mb-5">
      <v-text-field
        v-model="newTodo"
        label="Add a new todo"
        variant="outlined"
        hidde-details
      />
      <v-btn type="submit" color="green" block height="45" :disabled="!newTodo"
        >Add</v-btn
      >
    </v-form>
    <v-divider class="mb-3"></v-divider>

    <div class="px-1" v-if="todos && todos.length > 0">
      <p>My list:</p>
      <v-list>
        <transition-group name="slide-fade" tag="div">
          <TodoItem
            v-for="todo in todos"
            :key="todo.id"
            :todo="todo"
            @delete="deleteTodo"
            @update="updateTodo"
            @openDialog="setCurrentlySelectedTodo"
          />
        </transition-group>
      </v-list>
    </div>
    <p v-else class="text-center">No todos found</p>

    <Toaster
      :active="active"
      :message="message"
      :status="toasterStatus"
      @close="closeToaster"
    />

    <TodoDialog
      :active="openDialog"
      :data="currentlySelectedTodo"
      @update="updateTodo"
      @close="openDialog = false"
    />
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, computed, reactive } from "vue";
import TodoItem from "./TodoItem.vue";
import { TodoItemType } from "@/types/todo-item";
import Toaster from "./Toaster.vue";
import { useStore } from "vuex";
import { ToasterType } from "@/types/toaster";
import TodoDialog from "@/components/TodoDialog.vue";

export default defineComponent({
  components: { TodoItem, Toaster, TodoDialog },

  setup() {
    const newTodo = ref<string>("");
    const active = ref<boolean>(false);
    const openDialog = ref<boolean>(false);
    const message = ref<string>("");
    const toasterStatus = ref<string>("");

    let currentlySelectedTodo = reactive<TodoItemType>({
      task: "",
      completed: false,
      content: "",
      status: "todo",
      createdAt: 0,
    });

    const store = useStore();
    const todos = computed(() => {
      return store.getters.getTodoList?.sort(
        (fisrtItem: TodoItemType, secondItem: TodoItemType) => {
          const statusOrder = ["todo", "in progress", "done"];
          const statusComparison =
            statusOrder.indexOf(fisrtItem.status) -
            statusOrder.indexOf(secondItem.status);

          if (statusComparison === 0) {
            return secondItem.createdAt - fisrtItem.createdAt;
          }
          return statusComparison;
        }
      );
    });

    const addTodo = () => {
      if (newTodo.value.trim() !== "") {
        let payloadItem: TodoItemType = {
          id: Math.floor(Math.random() * 1000),
          task: newTodo.value,
          completed: false,
          content: "You Can Add Content Here",
          status: "todo",
          createdAt: new Date().getTime(),
        };
        store.dispatch("addNewTodoItem", payloadItem);
        setToaster(true, "Todo added successfully!", "success");
        newTodo.value = "";
      }
    };

    const deleteTodo = (id: number) => {
      store.dispatch("deleteTodoItem", id);
      setToaster(true, "Todo deleted successfully!", "error");
    };

    const setToaster = (
      activeValue: boolean,
      messageValue: string,
      statusValue: string
    ) => {
      active.value = activeValue;
      toasterStatus.value = statusValue;
      message.value = messageValue;
    };

    const closeToaster = () => {
      active.value = false;
    };

    const updateTodo = (payload: TodoItemType) => {
      store.dispatch("updateTodoItem", payload);
      openDialog.value = false;
      setToaster(true, "Todo updated successfully!", "success");
    };
    const setCurrentlySelectedTodo = (todo: TodoItemType) => {
      openDialog.value = true;
      Object.assign(currentlySelectedTodo, todo);
    };

    return {
      todos,
      newTodo,
      addTodo,
      deleteTodo,
      active,
      message,
      toasterStatus,
      closeToaster,
      updateTodo,
      openDialog,
      setCurrentlySelectedTodo,
      currentlySelectedTodo,
    };
  },
});
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
  transition-delay: 0.1s;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
.slide-fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.completed {
  text-decoration: line-through;
  color: gray;
}
</style>
