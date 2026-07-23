import { NextResponse } from 'next/server';
import { getDB, initDB, saveDB } from '@/lib/db';

export async function GET() {
  try {
    await initDB();
    const db = await getDB();

    const stmt = db.prepare('SELECT * FROM todos ORDER BY created_at DESC;');
    const todos = [];
    while (stmt.step()) {
      todos.push(stmt.getAsObject());
    }
    stmt.free();

    return NextResponse.json(todos);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'データベースからのデータ取得に失敗しました。' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title } = body;

    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: 'タイトルは必須項目です。' },
        { status: 400 }
      );
    }

    const db = await getDB();

    db.run('INSERT INTO todos (title) VALUES (?);', [title.trim()]);
    saveDB();

    const stmt = db.prepare('SELECT * FROM todos ORDER BY id DESC LIMIT 1;');
    let newTodo = null;
    if (stmt.step()) {
      newTodo = stmt.getAsObject();
    }
    stmt.free();

    return NextResponse.json(newTodo, { status: 201 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'データベースへの保存に失敗しました。' },
      { status: 500 }
    );
  }
}