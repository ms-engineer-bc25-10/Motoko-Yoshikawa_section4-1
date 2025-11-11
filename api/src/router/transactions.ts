import { Router } from "express";
const router = Router();

/// GET /transactions
router.get("/", (req, res) => {
  // 設計書どおりのダミーデータ
  const transactions = [
    {
      id: "1",
      date: "2025-11-01",
      type: "収入",
      amount: 50000,
      memo: "給与",
    },
    {
      id: "2",
      date: "2025-11-02",
      type: "支出",
      amount: 1200,
      memo: "ランチ",
    },
  ];

  return res.status(200).json(transactions);
});;

// GET /transactions/:id
router.get('/:id', (req, res) => {  //URL パラメータ :id を受け取れている
  const { id } = req.params;

  // ダミーデータをそのまま流用
  const transactions = [
    { id: "1", date: "2025-11-01", type: "収入", amount: 50000, memo: "給与" },
    { id: "2", date: "2025-11-02", type: "支出", amount: 1200, memo: "ランチ" }
  ];

  const target = transactions.find(t => t.id === id);  //ダミーデータの中から find で検索できている

  if (!target) {
    return res.status(404).json({ error: "transaction not found" });  //見つからなければ 404
  }

  return res.status(200).json(target);  //見つかれば 200 & データ返却
});

// POST /transactions
router.post("/", (req, res) => {
  const { date, type, amount, memo } = req.body;

  // ① date 必須 & フォーマットチェック「先頭から末尾まで、4桁数字 → - → 2桁数字 → - → 2桁数字 の形に完全一致する」
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!date || !dateRegex.test(date)) {
    return res.status(400).json({ error: "date must be YYYY-MM-DD" });
  }

  // ② type 必須 & 値のチェック
  if (!type || (type !== "収入" && type !== "支出")) {
    return res.status(400).json({ error: 'type must be "収入" or "支出"' });
  }

  // ③ amount 必須 & 数値チェック
  if (amount === undefined || typeof amount !== "number") {
    return res.status(400).json({ error: "amount must be a number" });
  }

  // ④ memo 任意だが、存在するなら string に制限
  if (memo !== undefined && typeof memo !== "string") {
    return res.status(400).json({ error: "memo must be a string" });
  }

  // ⑤ 全部OKなら、登録成功レスポンスを返す
  const newTransaction = {
    id: Date.now(),        // ← 修正ポイント！！
    date,
    type,
    amount,
    memo: memo || ""
  };

  return res.status(201).json(newTransaction);
});

export default router;