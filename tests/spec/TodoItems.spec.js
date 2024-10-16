import { mount, shallowMount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import TodoItems from "@/components/TodoItems.vue";
import { createStore } from "vuex";
import TodoItem from "@/components/TodoItem.vue";

// Create a mock Vuex store
const store = createStore({
  state: {
    todoList: [
      {
        id: 1,
        task: "First task",
        status: "todo",
        completed: false,
        createdAt: Date.now(),
      },
    ],
  },
  getters: {
    getTodoList: (state) => state.todoList,
  },
  actions: {
    addNewTodoItem: vi.fn(),
    deleteTodoItem: vi.fn(),
    updateTodoItem: vi.fn(),
  },
});

describe("TodoItems.vue", () => {
  let newStore;

  beforeEach(() => {
    // Create a Vuex store with a mocked action
    newStore = createStore({
      actions: {
        addNewTodoItem: vi.fn(),
        deleteTodoItem: vi.fn(),
        updateTodoItem: vi.fn(),
      },
    });

    // Spy on the dispatch method
    vi.spyOn(newStore, "dispatch");
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders the todo list correctly", () => {
    const wrapper = mount(TodoItems, {
      global: {
        plugins: [store],
      },
    });
    const todoItem = wrapper.findComponent(TodoItem);
    expect(todoItem.exists()).toBe(true);
  });

  it("adds a new todo item", async () => {
    const wrapper = mount(TodoItems, {
      global: {
        plugins: [newStore],
      },
    });
    const input = wrapper.find("input");
    await input.setValue("New todo");
    await wrapper.find("form").trigger("submit.prevent");
    expect(newStore.dispatch).toHaveBeenCalledWith(
      "addNewTodoItem",
      expect.any(Object)
    );
    expect(newStore.dispatch).toHaveBeenCalledTimes(1);
  });

  it("does not add an empty todo", async () => {
    const wrapper = mount(TodoItems, {
      global: {
        plugins: [store],
      },
    });
    const button = wrapper.find("button");
    expect(button.attributes("disabled")).toBe("");
  });

  it("deletes a todo item", async () => {
    const wrapper = shallowMount(TodoItems, {
      global: {
        plugins: [newStore],
      },
    });

    await wrapper.vm.deleteTodo(1);

    expect(newStore.dispatch).toHaveBeenCalledWith("deleteTodoItem", 1);
    expect(newStore.dispatch).toHaveBeenCalledTimes(1);
  });

  it("shows toaster on success", async () => {
    const wrapper = mount(TodoItems, {
      global: {
        plugins: [store],
      },
    });

    expect(wrapper.vm.active).toBe(false);
    await wrapper.vm.addTodo();
    await wrapper.vm.$nextTick();
    setTimeout(() => {
      expect(wrapper.vm.active).toBe(true);
      expect(wrapper.vm.message).toBe("Todo added successfully!");
    }, 1000);
  });

  it("dispatches updateTodoItem when a todo is updated", async () => {
    const wrapper = mount(TodoItems, {
      global: {
        plugins: [newStore],
      },
    });

    const todoToUpdate = { id: 1, task: "Updated Task" }; // Example todo
    await wrapper.vm.updateTodo(todoToUpdate);

    expect(newStore.dispatch).toHaveBeenCalledWith(
      "updateTodoItem",
      todoToUpdate
    );
  });
});
