import { describe, it, expect, beforeAll, afterAll } from 'vitest'; // vitest の describe / it / expect を使う準備
import request from 'supertest'; // supertest（HTTP リクエストを擬似的に送ってテストするツール）を読み込み
import { app } from '../app'; // app.tsの書き方次第で変更。「Express アプリに対してネットワーク越しにリクエストを送る準備」をしている部分。

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
