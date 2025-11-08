// app/api/todos/[id]/route.ts
import { NextResponse } from 'next/server'
import { findById, updateTodo, deleteTodo } from '../../../../lib/todos'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const found = findById(id)
    if (!found) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(found)
  } catch (err) {
    console.error('GET /api/todos/[id] error', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const payload = await request.json().catch(() => null)
    if (!payload || typeof payload !== 'object') {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 })
    }

    // Only allow `title` and `done` updates
    const patch: any = {}
    if (typeof payload.title === 'string') patch.title = payload.title.trim()
    if (typeof payload.done === 'boolean') patch.done = payload.done

    if (Object.keys(patch).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    const updated = updateTodo(id, patch)
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(updated)
  } catch (err) {
    console.error('PUT /api/todos/[id] error', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const removed = deleteTodo(id)
    if (!removed) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(removed)
  } catch (err) {
    console.error('DELETE /api/todos/[id] error', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
