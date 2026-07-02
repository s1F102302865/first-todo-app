# 1. ベースとなる環境（OS + Node.js）を公式倉庫から持ってくる
FROM node:20-alpine

# 2. コンテナ（仮想部屋）の中の、どのフォルダを作業場所にするか指定
WORKDIR /app

# 3. まず依存関係のリスト（package.jsonなど）だけをコンテナの中にコピー
COPY package*.json ./

# 4. コンテナの中でライブラリをインストールする
RUN npm install

# 5. 残りのすべてのコードやファイルをコンテナに丸ごとコピー
COPY . .

# 6. コンテナのポート番号（Next.jsの3000番）を開放
EXPOSE 3000

# 7. コンテナが起動した瞬間に実行されるコマンドを指定
CMD ["npm", "run", "dev"]