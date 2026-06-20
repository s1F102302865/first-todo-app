import { NextResponse } from 'next/server';
import { openDB, initDB } from '@/lib/db'; // 先ほど作ったファイルをインポート

// GETリクエスト（データ取得）の処理
export async function GET() {
  try {
    // 1. データベースの初期化（テーブルがなければ作成）
    await initDB();

    // 2. データベースを開く
    const db = await openDB();

    // 3. 生のSQLでデータを全件取得（作成日時の新しい順）
    const todos = await db.all('SELECT * FROM todos ORDER BY created_at DESC;');

    // 4. 取得したデータをフロントエンドにJSON形式で返す
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
  let db;
  try {
    // 1. フロント（またはテストツール）から送られてきたJSONデータを解析
    const body = await request.json();
    const { title } = body;

    // バリデーション（タイトルが空ならエラーにするハサミの役割）
    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: 'タイトルは必須項目です。' },
        { status: 400 }
      );
    }

    // 2. データベースを開く
    db = await openDB();

    // 3. 【生のSQL】INSERT INTO を使ってデータを保存！
    // 💡 安全対策（SQLインジェクション対策）のため、値は「?」にして第二引数で渡すのが鉄則です
    const result = await db.run(
      'INSERT INTO todos (title) VALUES (?);',
      title.trim()
    );

    // 4. 今入れたデータのIDを使って、保存されたデータを取得する
    const newTodo = await db.get('SELECT * FROM todos WHERE id = ?;', result.lastID);

    // 5. 新しく作ったToDoをフロントに返す（ステータス201: Created）
    return NextResponse.json(newTodo, { status: 201 });

  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'データベースへの保存に失敗しました。' },
      { status: 500 }
    );
  } finally {
    // 💡 用事が済んだら必ず閉じる（これでロックを防ぐ！）
    if (db) {
      await db.close();
      console.log('POST処理完了：データベースの接続を閉じました。');
    }
  }
}