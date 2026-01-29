import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../app';
import { prisma } from '../context/prisma';

describe('POST /transactions', () => {
  beforeEach(async () => {
    await prisma.transaction.deleteMany(); // テーブルを空にする
  });

  it('正常系: 1件の明細が作成される', async () => {
    const mockData = {
      date: new Date('2025-01-01'),
      type: 'expense',
      amount: 2500,
      memo: '本',
    };

    const res = await request(app).post('/transactions').send(mockData);

    //201が返る
    expect(res.status).toBe(201);

    //作られたデータの中にIDが入ってる
    expect(res.body).toHaveProperty('id');

    //送ったデータと同じ内容で保存されている
    expect(res.body).toMatchObject({
      type: 'expense',
      amount: 2500,
      memo: '本',
    });

    const record = await prisma.transaction.findUnique({
      // supertestでPOSTしたデータがSQLiteに実際に保存されたかを確認
      where: { id: res.body.id },
    });

    expect(record).not.toBeNull(); // DBにデータが保存されていればrecordはオブジェクト。保存されていなければrecordはnull
    expect(record?.amount).toBe(2500); // record.amountが2500であることを確認。POSTしたデータのamountが正しくDBに保存されたかチェック。record?.amountとしてるのはもしrecordがnullの時にエラーにならないように保険
  });

  it('異常系: 必須項目がないと400になる', async () => {
    const res = await request(app).post('/transactions').send({
      amount: 1000,
    }); // date,type,memoがない

    expect(res.status).toBe(400); //status 400 になること。
  });
});
