// app/components/TodoList.tsx
'use client'
import React, { useEffect, useState } from 'react'

type Todo = { id: string; title: string; done: boolean }

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/todos')
      if (!res.ok) throw new Error('Failed to load')
      const data = await res.json()
      setTodos(data)
    } catch (err: any) {
      setError(err.message || 'Error loading todos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function addTodo() {
    if (!newTitle.trim()) return
    setError(null)
    try {
      const res = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err?.error || 'Failed to create')
      }
      const created = await res.json()
      setTodos((t) => [...t, created])
      setNewTitle('')
    } catch (err: any) {
      setError(err.message || 'Error creating todo')
    }
  }

  async function toggle(todo: Todo) {
    setError(null)
    try {
      const res = await fetch(`/api/todos/${todo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ done: !todo.done }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err?.error || 'Failed to update')
      }
      const updated = await res.json()
      setTodos((t) => t.map((x) => (x.id === updated.id ? updated : x)))
    } catch (err: any) {
      setError(err.message || 'Error updating todo')
    }
  }

  async function remove(id: string) {
    setError(null)
    try {
      const res = await fetch(`/api/todos/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err?.error || 'Failed to delete')
      }
      setTodos((t) => t.filter((x) => x.id !== id))
    } catch (err: any) {
      setError(err.message || 'Error deleting todo')
    }
  }

  return (
    <div>
      <h2>Todos</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <div>
        <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="New todo" />
        <button onClick={addTodo}>Add</button>
        <button onClick={load} disabled={loading} style={{ marginLeft: 8 }}>
          Refresh
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {todos.map((todo) => (
            <li key={todo.id}>
              <label>
                <input type="checkbox" checked={todo.done} onChange={() => toggle(todo)} />
                {todo.title}
              </label>
              <button onClick={() => remove(todo.id)} style={{ marginLeft: 8 }}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
