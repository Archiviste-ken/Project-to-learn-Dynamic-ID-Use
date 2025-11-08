// app/api/todos/route.ts
import { NextResponse } from 'next/server'
import { getAll, createTodo } from '../../../lib/todos'

export async function GET() {
  try {
    const todos = getAll()
    return NextResponse.json(todos)
  } catch (err) {
    console.error('GET /api/todos error', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null)
    if (!body || typeof body.title !== 'string' || !body.title.trim()) {
      return NextResponse.json({ error: 'Invalid payload, expected { title: string }' }, { status: 400 })
    }
    const todo = createTodo(body.title.trim())
    return NextResponse.json(todo, { status: 201 })
  } catch (err) {
    console.error('POST /api/todos error', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
