import cors from 'cors';
import express, { Request, Response } from 'express';
import transactionRouter from './router/transactions';
import summaryRouter from './router/summary';
import logger from './context/logger';
import morgan from 'morgan';

const app = express();

// JSON
app.use(express.json());
app.use(cors());

// ログ
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));

// ルーター
app.use('/transactions', transactionRouter);
app.use('/summary', summaryRouter);

// 動作確認
app.get('/', (req: Request, res: Response) => {
  res.send('こんにちは！');
});

// エラーハンドラー
app.use((err: unknown, req: Request, res: Response, next: Function) => {
  console.error('🔥 Express Error:', err);

  if (err instanceof Error) {
    return res.status(500).json({ error: err.message });
  }

  return res.status(500).json({ error: 'Internal Server Error' });
});

export { app };
