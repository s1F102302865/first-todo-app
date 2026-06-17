"use client";

import { useState } from 'react'

interface Todo {
  id: string;
  title: string;
  isCompleted: boolean;
}

export default function App() {

  // 三つのデータを初回で保存し、それを二回目以降を保存し続け提供してくれる
  const [todos, setTodos] = useState<Todo[]>([
    { id: '1', title: 'Reactの環境構築をする', isCompleted: true },
    { id: '2', title: 'モダンなフロントエンド画面を完成させる', isCompleted: true },
    { id: '3', title: 'HonoでバックエンドAPIを作る（来週）', isCompleted: false },
  ]);

  // 初期値は空です
  // 入力欄で文字が入力される度に、newTodoTitleの中身が更新されていく
  const [newTodoTitle, setNewTodoTitle] = useState('');

  const handleAddTodo = (e: React.FormEvent) => {
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

    const newTodo: Todo = {
      // 謎の英数字のIDを自動で生成
      id: crypto.randomUUID(),
      // 入力された値が渡される...todos, newTodo]); // 👈 点々3つで今までのタスクをぶちまけ、新しいカードを合体さ
      title: newTodoTitle,
      // 初期設定は未完了
      isCompleted: false,
    };

    // Stateの更新
    // 点々3つで今までのタスクをぶちまけ、新しいカードを合体させて、Reactのメインお弁当箱を新しくする
    setTodos([...todos, newTodo]);

    // 次の入力のために、input用のメモ帳だけ空っぽ（''）にお掃除！
    setNewTodoTitle('');
  };

  const handleToggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
      )
    );
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
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
                    todo.isCompleted 
                      ? 'bg-cyan-600 border-cyan-600 text-white' 
                      : 'border-slate-600'
                  }`}>
                    {todo.isCompleted && (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    )}
                  </div>
                  <span className={`text-sm transition-all ${
                    todo.isCompleted ? 'line-through text-slate-500' : 'text-slate-200'
                  }`}>
                    {todo.title}
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