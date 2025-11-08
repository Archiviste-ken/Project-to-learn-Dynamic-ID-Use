// lib/todos.ts
export type Todo = { id: string; title: string; done: boolean }

/**
 * Simple in-memory store for learning purposes.
 * It's stored on globalThis so HMR / module reloads don't wipe it every import.
 */
const G = globalThis as any
if (!G.__TODOS_STORE) {
  G.__TODOS_STORE = [
    { id: '1', title: 'Learn Next.js', done: false },
    { id: '2', title: 'Build CRUD', done: false },
  ] as Todo[]
}

function nextId() {
  return String(Date.now() + Math.floor(Math.random() * 1000))
}

export function getAll(): Todo[] {
  return G.__TODOS_STORE as Todo[]
}

export function findById(id: string): Todo | undefined {
  return getAll().find((t) => t.id === id)
}

export function createTodo(title: string): Todo {
  const todo: Todo = { id: nextId(), title, done: false }
  getAll().push(todo)
  return todo
}

export function updateTodo(id: string, patch: Partial<Todo>): Todo | null {
  const todos = getAll()
  const idx = todos.findIndex((t) => t.id === id)
  if (idx === -1) return null
  todos[idx] = { ...todos[idx], ...patch }
  return todos[idx]
}

export function deleteTodo(id: string): Todo | null {
  const todos = getAll()
  const idx = todos.findIndex((t) => t.id === id)
  if (idx === -1) return null
  return todos.splice(idx, 1)[0]
}
