import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../app';
import { prisma } from '../context/prisma';

let transactionId: number; // テストで使用するトランザクションID

describe('DElETE /transactions/:id', () => {
  beforeEach(async () => {
    await prisma.transaction.deleteMany(); // テーブルを空にする

    // 新しいトランザクションを追加して取得
    const mockTransaction = await prisma.transaction.create({
      data: {
        date: new Date('2025-01-01'),
        type: 'expense',
        amount: 2500,
        memo: '本',
      },
    });

    transactionId = mockTransaction.id; // 追加したトランザクションのIDを保存。そのIDをテスト全体で使う
  });

  it('should delete a transaction by id', async () => {
    const response = await request(app).delete(`/transactions/${transactionId}`); // DELETEリクエスト

    expect(response.status).toBe(204); // ステータスコード204（削除成功）を期待。正常に削除できるか？IDを指定して削除したら、APIが204を返して正常に削除できていることを確認
  });

  it('should not find the deleted transaction', async () => {
    //先にDELETEして削除する
    await request(app).delete(`/transactions/${transactionId}`);
    //削除後にGET
    const getResponse = await request(app).get(`/transactions/${transactionId}`);

    expect(getResponse.status).toBe(404); // 削除したIDをGETしたら404が返ってくることを期待
    expect(getResponse.body).toHaveProperty('error', 'transaction not found'); // エラーメッセージを確認。APIの「削除後の挙動」が正しいことを検証
  });

  it('should return 404 for non-existent transaction', async () => {
    //存在しないIDを使ってDELETEを試みることで、エラーハンドリングを確認
    const nonExistentId = 999999; // 存在しないID

    const response = await request(app).delete(`/transactions/${nonExistentId}`);

    expect(response.status).toBe(404); //存在しないIDを削除しようとしたら404が返るべき
    expect(response.body).toHaveProperty('error', 'transaction not found');
  });
});
