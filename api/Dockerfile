# Node.js の公式イメージを使用
FROM node:18

# アプリ作成ディレクトリ
WORKDIR /usr/src/app

# package.json をコピー
COPY package*.json ./

# 依存パッケージをインストール
RUN npm install

# prisma ファイルをコピー
COPY prisma ./prisma

# Prisma のクライアントを生成
RUN npx prisma generate

# 残りのプロジェクトファイルをコピー
COPY . .

# アプリを起動するポート
EXPOSE 4000

# サーバー起動
CMD ["npm", "run", "dev"]