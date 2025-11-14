console.log("🚀 transactions Router が読み込まれたよ！");
import { error } from "console";
import { Router } from "express";
const router = Router();

import { prisma } from "../context/prisma";

/// GET /transactions
router.get("/", async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { id: "asc" }
    });

    return res.status(200).json(transactions);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET /transactions/:id
router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);

  const transaction = await prisma.transaction.findUnique({
    where: { id }
  });

  if (!transaction) {
    return res.status(404).json({ error: "transaction not found" });
  }

  return res.json(transaction);
});

// POST /transactions
router.post("/", async (req, res) => {
  console.log("📩 受け取ったデータ raw:", req.body);
  try {
    console.log("📩 バリデーション前:", req.body);

    const { date, type, amount, memo } = req.body;

    const amountNumber = Number(amount);
    console.log("📌 数値変換後:", amountNumber);

    if (isNaN(amountNumber)) {
      return res.status(400).json({ error: "amount must be a number" });
    }

    // --- DB 登録 ---
    const newTransaction = await prisma.transaction.create({
      data: {
        date: new Date(date),   // 必須：Prisma の DateTime は Date 型
        type,
        amount: amountNumber,
        memo: memo || ""
      }
    });

    return res.json(newTransaction);

  } catch (error) {
    console.error("POST /transactions error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// PUT /transactions/:id
router.put("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { date, type, amount, memo } = req.body;

    if (typeof amount !== "number") {
      return res.status(400).json({ error: "amount must be a number" });
    }

    // ① 更新対象が存在するかチェック
    const exists = await prisma.transaction.findUnique({ where: { id } });
    if (!exists) {
      return res.status(404).json({ error: "transaction not found" });
    }

    const updated = await prisma.transaction.update({
      where: { id },
      data: { date, type, amount, memo },
    });

    return res.json(updated);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE /transactions/:id
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const exists = await prisma.transaction.findUnique({ where: { id } });
    if (!exists) {
      return res.status(404).json({ error: "transaction not found" });
    }

    await prisma.transaction.delete({ where: { id } });

    return res.status(204).send();
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;