import express, { Request, Response } from 'express';

import userRouter from './router/user';

const app = express();
const port = 4000;

app.use('/user', userRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('こんにちは！');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});