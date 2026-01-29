import { PrismaClient } from './generated/prisma/client'  //「Prisma が DB とちゃんと繋がるかテストするためだけの単独スクリプト」① PrismaClient を生成する.チュートリアルでよく出てくる「動作確認」用ファイル

const prisma = new PrismaClient()  //→ Prisma が MySQL に接続する「クライアント」を作ってる。

async function main() {
  console.log("Prisma からデータ取得テストするよ！")  //② DB がちゃんと動くかのテストコード

  const all = await prisma.transaction.findMany()  //→ MySQL の transaction テーブルの全件取得を試して、ちゃんと接続できている？データが返ってくる？エラーにならない？を確認するための 動作テスト。
  console.log(all)
}

main()
  .then(async () => {
    await prisma.$disconnect()   //③ 実行後に接続を閉じる.DB 接続しっぱなしになると不具合が出るから、テストが終わったら閉じる。
  })
  .catch(async (e) => {         // ④ エラーが出た場合の処理.
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)             //→ エラーをログ出力して安全に終了させる。
  })