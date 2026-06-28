"use client";

import { useState, useEffect } from 'react' // 👈 サーバーからデータを自動で取るために useEffect を追加！

interface Todo {
  id: number;          // 👈 SQLiteの自動連番(AUTOINCREMENT)に合わせて number に変更
  title: string;
  is_completed: number; // 👈 SQLiteの 0か1 の仕様に合わせて変更
  created_at?: string;  // 👈 SQLiteが刻んでくれる作成日時を追加
}

export default function App() {

  // 💡 データベースから本物のデータを詰めるため、最初は空っぽの配列（ [] ）からスタートします！
  const [todos, setTodos] = useState<Todo[]>([]);

  // 初期値は空です
  // 入力欄で文字が入力される度に、newTodoTitleの中身が更新されていく
  const [newTodoTitle, setNewTodoTitle] = useState('');

  // 📥 【新しく追加】データベース（サーバー）から最新のタスク一覧を引っ張ってくる関数
  const fetchTodos = async () => {
    try {
      const res = await fetch('/api/todos'); // 👈 手ぶらでトラック（GET）を走らせる
      const data = await res.json();
      setTodos(data); // お弁当箱（State）を最新のデータに更新！
    } catch (error) {
      console.error('データの取得に失敗しました:', error);
    }
  };

  // 🏃‍♂️ 【新しく追加】画面がパッと開いた瞬間に、自動で上の fetchTodos を実行するトリガー
  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAddTodo = async (e: React.FormEvent) => { // 👈 非同期通信(fetch)を使うので async を追加
    // ブラウザリロード阻止
    e.preventDefault();

    // ''のとき、false扱いになる
    // ↓
    // ! false = Trueになる
    // ↓
    // 条件が成立し、return文が実行される

    //   if (newTodoTitle.trim() === '') {
    //   return; 
    // }
    if (!newTodoTitle.trim()) return;

    try {
      // 🚀 ここで本物のサーバー（route.ts）のPOSTメソッドに向けてデータを渡す！
      const res = await fetch('/api/todos', {
        method: 'POST', // 👈 これが「荷物を送信（保存）する」というサイン！
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTodoTitle }), // 👈 これが「荷物の中身（データ）」！
      });

      if (res.ok) {
        // 次の入力のために、input用のメモ帳だけ空っぽ（''）にお掃除！
        setNewTodoTitle('');

        // 💡 サーバー側への保存が成功した瞬間に、自動でもう一度一覧を取得して画面を書き換える！
        fetchTodos();
      }
    } catch (error) {
      console.error('データの保存に失敗しました:', error);
    }
  };

  const handleToggleTodo = async (id: number) => { // 👈 idをnumberに変更
    // 今クリックされたタスクを配列内から探し出す
    const currentTodo = todos.find((todo) => todo.id === id);
    if (!currentTodo) return;

    try {
      // 1. バックエンドのPATCH APIに向けて、現在の「is_completed」の値を荷物（JSON）として送る
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_completed: currentTodo.is_completed }),
      });

      if (!response.ok) {
        throw new Error('状態の更新に失敗しました');
      }

      // 2. 💡【超重要】DBの更新が成功したら、最新のデータを再取得して画面を自動更新！
      await fetchTodos();

    } catch (error) {
      console.error('更新エラー:', error);
      alert('更新に失敗しました');
    }
  };
  // 🎯 【修正版】タスクを削除する本命の関数（APIと連動）
  const handleDeleteTodo = async (id: number) => {
    try {
      // 1. バックエンドのAPIに削除リクエストを送信
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('削除に失敗しました');
      }

      // 2. 💡【超重要】削除が成功したら、最新のデータを再取得して画面を自動更新！
      await fetchTodos(); 
    
      alert('削除しました！'); // 動作確認用の仮アラート
    } catch (error) {
      console.error(error);
      alert('エラーが発生しました');
    }
  };

  return (
    <div className="flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-6 space-y-6">
        
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent py-1">
            らんちゃんの Todo アプリ
          </h1>
          <p className="text-xs text-slate-400 mt-1">SQL版ロードマップ - 第1サイクル</p>
        </div>

        {/* ボタンが押されると、onSubmitがトリガーとなり、handleAddTodo関数が呼ばれる */}
        <form onSubmit={handleAddTodo} className="flex gap-2">
          {/* /* ReactのnewTodoTitleへデータを渡しているバトン➀ */}
          <input
            type="text"
            placeholder="新しいタスクを入力してね"
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
          <button
            type="submit"
            className="bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
          >
            追加
          </button>
        </form>

        <div className="space-y-2">
          {todos.length === 0 ? (
            <p className="text-center text-sm text-slate-500 py-4">タスクはありません</p>
          ) : (
            todos.map((todo) => (
              <div
                key={todo.id}
                className="flex items-center justify-between bg-slate-800/50 border border-slate-800 rounded-xl p-3 hover:border-slate-700 transition-all group"
              >
                <div className="flex items-center gap-3 flex-1 cursor-pointer" onClick={() => handleToggleTodo(todo.id)}>
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                    todo.is_completed === 1 // 👈 完了条件を boolean から 1 に変更
                      ? 'bg-cyan-600 border-cyan-600 text-white' 
                      : 'border-slate-600'
                  }`}>
                    {todo.is_completed === 1 && ( // 👈 完了条件を 1 に変更
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    )}
                  </div>
                  <span className={`text-sm transition-all ${
                    todo.is_completed === 1 ? 'line-through text-slate-500' : 'text-slate-200' // 👈 完了条件を 1 に変更
                  }`}>
                    {todo.title}
                    {/* 👇 SQLiteが自動生成した日時を、タスクの横にひっそり表示するおまけ機能！ */}
                    {todo.created_at && (
                      <span className="text-[10px] text-slate-500 block">⏱ {todo.created_at}</span>
                    )}
                  </span>
                </div>

                <button
                  onClick={() => handleDeleteTodo(todo.id)}
                  className="text-slate-500 hover:text-red-400 p-1 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}