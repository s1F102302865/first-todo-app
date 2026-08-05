import { NextResponse } from 'next/server';
import { getDB, saveDB } from '@/lib/db';

// 1. DELETE リクエスト（タスク削除）
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDB();

    db.run('DELETE FROM todos WHERE id = ?;', [id]);
    saveDB();

    return NextResponse.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'データの削除に失敗しました。' },
      { status: 500 }
    );
  }
}

// 2. PATCH リクエスト（完了/未完了の切り替え更新）
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { is_completed } = body;

    const db = await getDB();

    db.run('UPDATE todos SET is_completed = ? WHERE id = ?;', [
      is_completed ? 1 : 0,
      id,
    ]);
    saveDB();

    return NextResponse.json({ message: 'Todo updated successfully' });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'データの更新に失敗しました。' },
      { status: 500 }
    );
  }
}