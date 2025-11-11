import { Router } from "express";
const router = Router();

// GET /summary
router.get("/", (req, res) => {
  res.json({
    income: 50000,
    expense: 5250,
    balance: 44750
  });
});

export default router;