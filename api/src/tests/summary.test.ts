import { describe, it, expect, beforeEach } from 'vitest'; // beforeEach→各テストの直前に毎回実行される処理
import request from 'supertest';
import { app } from '../app';
import { prisma } from '../context/prisma'; // DB にテストデータを入れるため

describe('GET /summary', () => {
  beforeEach(async () => {
    // テスト前に DB を完全クリア。deleteMany() → そのテスト用に余分なデータを消す
    await prisma.transaction.deleteMany();
    // 毎回同じ状態からスタートできるようにするためテストが始まる度に DB に4件のデータを入れている。createMany() → テストが想定するデータを再現する（収入2件、支出2件など）
    await prisma.transaction.createMany({
      data: [
        { date: new Date(), type: 'income', amount: 10000, memo: '給料' },
        { date: new Date(), type: 'income', amount: 5000, memo: '副業' },
        { date: new Date(), type: 'expense', amount: 3000, memo: '昼ごはん' },
        { date: new Date(), type: 'expense', amount: 2000, memo: 'カフェ' },
      ],
    });
  });

  it('正常系: 収入/支出/残高が正しく返る', async () => {
    const res = await request(app).get('/summary');

    expect(res.status).toBe(200);

    // 期待値
    expect(res.body.income).toBe(15000); // 10000 + 5000
    expect(res.body.expense).toBe(5000); // 3000 + 2000
    expect(res.body.balance).toBe(10000); // 15000 - 5000
  });

  it('データがゼロでも正しく動く', async () => {
    // DB を空に戻す。データ0件のとき0 を返して正常に動くか
    await prisma.transaction.deleteMany();

    const res = await request(app).get('/summary');

    expect(res.status).toBe(200);
    expect(res.body.income).toBe(0);
    expect(res.body.expense).toBe(0);
    expect(res.body.balance).toBe(0);
  });
});

// 収入の合計 (income),支出の合計 (expense),残高 (balance = income - expense)を正しく返すか確認するテスト
