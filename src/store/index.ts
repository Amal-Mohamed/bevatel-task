import { createStore } from "vuex";
import { State } from "@/types/store-state";
import { TodoItemType } from "@/types/todo-item";
import VuexPersist from "vuex-persist";

const vuexPersist = new VuexPersist({
  key: "my-app", // The key for local storage
  storage: localStorage, // You can use localStorage or sessionStorage
});

// Define the state interface

// Create the Vuex store
const store = createStore<State>({
  state: {
    todoList: [
      {
        id: 1,
        task: "Prepare for frontend interview",
        content: "Study Vue.js and Vuex",
        status: "in progress",

        completed: false,
      },
      {
        id: 2,
        task: "Update portfolio website",
        content: "Add new projects and update resume",
        status: "todo",
        completed: false,
      },
      {
        id: 3,
        task: "Buy groceries",
        content: "Milk, eggs, bread, and fruits",
        status: "done",
        completed: false,
      },
    ], // Example state: toDoList
  },
  mutations: {
    addNewTodoItem(state, payload: TodoItemType) {
      state.todoList.push(payload);
    },
    deleteTodoItem(state, id: number) {
      state.todoList = state.todoList.filter((todo) => todo.id !== id);
    },
    updateTodoItem(state, payload: TodoItemType) {
      const index = state.todoList.findIndex((todo) => todo.id === payload.id);
      if (index !== -1) {
        state.todoList[index] = { ...state.todoList[index], ...payload };
      }
    },
  },
  actions: {
    addNewTodoItem({ commit }, payload) {
      commit("addNewTodoItem", payload);
    },
    deleteTodoItem({ commit }, id: number) {
      commit("deleteTodoItem", id);
    },
    updateTodoItem({ commit }, payload: TodoItemType) {
      commit("updateTodoItem", payload);
    },
  },
  getters: {
    getTodoList(state) {
      return state.todoList;
    },
  },
  plugins: [vuexPersist.plugin],
});

export default store;
