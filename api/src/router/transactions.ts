console.log('🚀 transactions Router が読み込まれたよ！'); //CRUD ルーター
import { Router } from 'express';
const router = Router();

import { prisma } from '../context/prisma'; // src/context/prisma.ts を作ったのでPrismaClient を使えるようにする。ダミーデータ削除して、Prisma 版の CRUD に置き換える

/// GET /transactions
router.get('/', async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      //Prisma.Express の API の中で データを取りに行ったり保存したりする係
      orderBy: { date: 'desc' },
    });

    return res.status(200).json(transactions);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /transactions/:id  ⚪︎ルート定義。/transactions/3 みたいに１つのIDデータだけ習得したいときに動くAPI
router.get('/:id', async (req, res) => {
  //transactions/◯◯ のように数字が入るパス（パラメータ付き）を受け取るルート。:id は 動的なパスのこと（3でも4でもOK）
  const id = Number(req.params.id); //リクエストからidを取り出す。req.params.id は URL の :id 部分。文字列で来るので Number() で数値に変換
  //URL : /transactions/7 → req.params.id は "7"→ id は 7（数値）
  const transaction = await prisma.transaction.findUnique({
    //Prisma でデータベースから探す。findUnique() は id が一致する1件だけ を検索する関数
    where: { id },
  });

  if (!transaction) {
    return res.status(404).json({ error: 'transaction not found' }); //もし見つからなかったら 404。例えば /transactions/99999 みたいに存在しない id なら→ null が返る→ "見つかりません" を 404 で返す
  }

  return res.json(transaction); // 見つかったら JSON を返す。Next.js などのフロント側はこれを受け取って画面に表示する
});

//POST /transactions
router.post('/', async (req, res) => {
  try {
    const { date, type, amount, memo } = req.body;

    // 必須項目チェック
    if (!date || !type || !memo) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const amountNumber = Number(amount);
    if (isNaN(amountNumber)) {
      return res.status(400).json({ error: 'amount must be a number' });
    }

    //  Prisma にそのまま渡す
    const newTransaction = await prisma.transaction.create({
      data: {
        date: new Date(date), // ← ★これが必要！！！
        type,
        amount: amountNumber,
        memo: memo || '',
      },
    });

    return res.status(201).json(newTransaction);
  } catch (error) {
    console.error('POST /transactions FULL ERROR:', error);
    return res.status(500).json({ error: String(error) });
  }
});

// PUT /transactions/:id
router.put('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { date, type, amount, memo } = req.body;

    if (typeof amount !== 'number') {
      return res.status(400).json({ error: 'amount must be a number' });
    }

    // ① 更新対象が存在するかチェック
    const exists = await prisma.transaction.findUnique({ where: { id } });
    if (!exists) {
      return res.status(404).json({ error: 'transaction not found' });
    }

    const updated = await prisma.transaction.update({
      where: { id },
      data: { date, type, amount, memo },
    });

    return res.json(updated);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE /transactions/:id
router.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);

    const exists = await prisma.transaction.findUnique({ where: { id } });
    if (!exists) {
      return res.status(404).json({ error: 'transaction not found' });
    }

    await prisma.transaction.delete({ where: { id } });

    return res.status(204).send();
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
