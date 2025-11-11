import cors from "cors";
import express, { Request, Response } from 'express';

import transactionRouter from "./router/transactions";
import summaryRouter from "./router/summary";

const app = express();
const port = 4000;

// JSONリクエストの解析
app.use(express.json());
app.use(cors());

// /transactions の担当者としてルーターを登録
app.use("/transactions", transactionRouter);
app.use("/summary", summaryRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('こんにちは！');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});