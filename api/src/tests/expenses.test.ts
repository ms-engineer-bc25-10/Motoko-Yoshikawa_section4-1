import { describe, it, expect, beforeEach } from 'vitest'; // vitest の describe / it / expect / beforeEach を使う準備
import request from 'supertest'; // supertest（HTTP リクエストを擬似的に送ってテストするツール）を読み込み
import { app } from '../app'; // app.tsの書き方次第で変更。「Express アプリに対してネットワーク越しにリクエストを送る準備」をしている部分。
import { prisma } from '../context/prisma';

describe('GET /transactions', () => {
  // テスト対象（GET /transactions）をグルーピング。中に複数の it()（＝実際のテスト）が入る
  it('正常系: ステータス200 & 配列が返る', async () => {
    // 正常系テスト：ステータス200 & 配列が返るか？
    const res = await request(app).get('/transactions'); // supertestを使ってGETリクエストを送る

    expect(res.status).toBe(200); // レスポンスステータスが 200 か確認
    expect(Array.isArray(res.body)).toBe(true); // レスポンスのJSONが配列であることを確認

    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty('id'); // 配列の中身のオブジェクトの型チェック。GET /transactionsは単に「DBからfindManyして配列返す」 DBが空 → [] が返る → 配列なので OK → テストパス
      expect(res.body[0]).toHaveProperty('type');
      expect(res.body[0]).toHaveProperty('amount');
      expect(res.body[0]).toHaveProperty('memo');
    }
  });

  it('異常系: 存在しないURLは404', async () => {
    // 異常系テスト：存在しないURLは404
    const res = await request(app).get('/notfound'); // 本来存在しない URL にアクセス
    expect(res.status).toBe(404); // Express が正しく 404 を返すか確認。予期しないURLに来たときに、適切なエラー応答が返ることを保証
  });
});

describe('GET /transactions/:id', () => {
  let transactionId: number; //beforeEachで作ったレコードのidをテストの外の変数に一度保存しておく箱。

  beforeEach(async () => {
    //各テストの前に毎回実行される。
    // deleteMany() でテーブルを空にしてから create()で1件だけ作成.そのレコードのidをtransactionIdに入れておく。
    await prisma.transaction.deleteMany();

    const created = await prisma.transaction.create({
      data: {
        date: new Date(),
        type: 'expense',
        amount: 1200,
        memo: 'ランチ',
      },
    });

    // 作ったレコードの id を覚えておく
    transactionId = created.id;
  });

  it('正常系: 指定した id の明細が返る', async () => {
    const res = await request(app).get(`/transactions/${transactionId}`); //GET /transactions/${transactionId} にリクエスト。

    expect(res.status).toBe(200); //status 200 になること。
    expect(res.body.id).toBe(transactionId); //id / type / amount / memo が、さっき作ったデータどおりになっていることをチェック。
    expect(res.body.type).toBe('expense');
    expect(res.body.amount).toBe(1200);
    expect(res.body.memo).toBe('ランチ');
  });

  it('異常系: 存在しない id のときは 404 が返る', async () => {
    const res = await request(app).get('/transactions/99999'); //ありえない id（例: 99999）で叩く。

    expect(res.status).toBe(404); //status 404 になること。
    expect(res.body).toEqual({ error: 'transaction not found' }); //	body が { error: 'transaction not found' } になっていることをチェック
  });
});
