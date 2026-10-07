const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const taskCount = document.getElementById("task-count");
const clearCompletedBtn = document.getElementById("clear-completed");

const STORAGE_KEY = "todo-list-items";

let todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function renderTodos() {
  todoList.innerHTML = "";

  if (todos.length === 0) {
    const emptyState = document.createElement("li");
    emptyState.className = "empty-state";
    emptyState.textContent = "No tasks yet. Add one above!";
    todoList.appendChild(emptyState);
  } else {
    todos.forEach((todo, index) => {
      const item = document.createElement("li");
      item.className = `todo-item ${todo.completed ? "completed" : ""}`;
      item.style.animationDelay = `${index * 40}ms`;

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = todo.completed;
      checkbox.className = "todo-checkbox";
      checkbox.setAttribute("aria-label", `Mark ${todo.text} as complete`);
      checkbox.addEventListener("change", () => toggleTodo(todo.id));

      const text = document.createElement("span");
      text.className = "todo-text";
      text.textContent = todo.text;

      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.className = "delete-btn";
      deleteBtn.textContent = "×";
      deleteBtn.setAttribute("aria-label", `Delete ${todo.text}`);
      deleteBtn.addEventListener("click", () => deleteTodo(todo.id));

      item.appendChild(checkbox);
      item.appendChild(text);
      item.appendChild(deleteBtn);
      todoList.appendChild(item);
    });
  }

  const remaining = todos.filter((todo) => !todo.completed).length;
  taskCount.textContent = `${remaining} task${remaining === 1 ? "" : "s"} left`;
  taskCount.classList.remove("pulse");
  void taskCount.offsetWidth;
  taskCount.classList.add("pulse");
}

function addTodo(text) {
  const cleanText = text.trim();
  if (!cleanText) return;

  todos.unshift({
    id: crypto.randomUUID(),
    text: cleanText,
    completed: false,
  });

  saveTodos();
  renderTodos();
}

function toggleTodo(id) {
  todos = todos.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo,
  );

  saveTodos();
  renderTodos();
}

function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  saveTodos();
  renderTodos();
}

function clearCompleted() {
  todos = todos.filter((todo) => !todo.completed);
  saveTodos();
  renderTodos();
}

todoForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addTodo(todoInput.value);
  todoInput.value = "";
  todoInput.focus();
});

clearCompletedBtn.addEventListener("click", clearCompleted);

renderTodos();
