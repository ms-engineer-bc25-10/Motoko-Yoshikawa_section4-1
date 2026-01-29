import { Router } from 'express';
import { prisma } from '../context/prisma'; // ← これが必要！
import { app } from '../app';

const router = Router();

// GET /summary
router.get('/', async (req, res) => {
  const income = await prisma.transaction.aggregate({
    _sum: { amount: true },
    where: { type: 'income' },
  });

  const expense = await prisma.transaction.aggregate({
    _sum: { amount: true },
    where: { type: 'expense' },
  });

  const balance = (income._sum.amount ?? 0) - (expense._sum.amount ?? 0);

  res.json({
    income: income._sum.amount ?? 0,
    expense: expense._sum.amount ?? 0,
    balance,
  });
});

export default router;
