import { NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

// データベースを開くヘルパー関数
const openDb = async () => {
  return open({
    // 🎯 実際のファイル名「database.sqlite」に完全一致させます！
    filename: path.join(process.cwd(), 'database.sqlite'), 
    driver: sqlite3.Database
  });
};

// DELETEメソッドの処理
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    console.log('消去要求が来たID:', id);

    const db = await openDb();

    // 🎯 テーブル名を本物の「todos」に指定して生SQLを実行！
    await db.run('DELETE FROM todos WHERE id = ?', id);

    return NextResponse.json({ message: '削除成功しました！' }, { status: 200 });
  } catch (error) {
    console.error('バックエンド削除エラー詳細:', error);
    return NextResponse.json({ error: '削除に失敗しました' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    
    // フロントエンドから「現在の完了状態（is_completed）」を送ってもらう
    const { is_completed } = await request.json();

    // 💡 データベースの値を反転させる処理
    // フロントから 1 が来たら 0 に、0 が来たら 1 にひっくり返す
    const nextStatus = is_completed === 1 ? 0 : 1;

    const db = await openDb();

    // 🎯 生SQLで指定したIDのタスクの完了状態をUPDATE！
    await db.run(
      'UPDATE todos SET is_completed = ? WHERE id = ?',
      nextStatus,
      id
    );

    console.log(`ID: ${id} の完了状態を ${nextStatus} に更新しました！`);

    return NextResponse.json({ message: '更新成功しました！', is_completed: nextStatus }, { status: 200 });
  } catch (error) {
    console.error('バックエンド更新エラー詳細:', error);
    return NextResponse.json({ error: '更新に失敗しました' }, { status: 500 });
  }
}