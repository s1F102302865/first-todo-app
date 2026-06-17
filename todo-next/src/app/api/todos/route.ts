import { NextResponse } from 'next/server';

// データベースの代わりとなる、仮のデータ（モック）
const mockTodos = [
  { id: 1, title: 'Next.jsに画面を移行する', completed: true },
  { id: 2, title: '最初のAPIを作って疎通する', completed: false },
  { id: 3, title: 'SQLiteを導入してSQLを書く', completed: false },
];

// データを取得する「GET」という窓口を作成
export async function GET() {
  return NextResponse.json(mockTodos);
}