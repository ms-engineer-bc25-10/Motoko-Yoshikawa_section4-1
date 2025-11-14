console.log("🔥🔥 app.ts が実行されたよ！！");
import cors from "cors";
import express, { Request, Response } from 'express';

import transactionRouter from "./router/transactions";
import summaryRouter from "./router/summary";
import logger from './context/logger';
import morgan from "morgan";

const app = express();
const port = 4000;

// JSONリクエストの解析
app.use(express.json());
app.use(cors());

// morgan のログを winston を経由して出力する
// combined フォーマットで出力し、ログレベルは info に設定
// "combined" は Apache風の詳細フォーマット（メソッド・URL・ステータスなど）
// app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// /transactions の担当者としてルーターを登録
app.use("/transactions", transactionRouter);
app.use("/summary", summaryRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('こんにちは！');
});

app.listen(port, () => {
  logger.debug("Debug Message");
  logger.info("Info Message");
  logger.warn("Warn Message");
  logger.error("Error Message");
  console.log(`Server running on http://localhost:${port}`);
});