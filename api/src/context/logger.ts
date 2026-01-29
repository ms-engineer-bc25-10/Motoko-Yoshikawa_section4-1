import winston from 'winston';
import dotenv from 'dotenv';

// .envの読み込み
dotenv.config();

// デフォルト値を 'info' に設定
const logLevel = process.env.LOG_LEVEL || 'info';

const logger = winston.createLogger({
    level: logLevel, // ←ここがポイント！
    format: winston.format.combine(
        winston.format.timestamp(),   // ← タイムスタンプを付ける
        winston.format.json()         // ← JSON形式で出す
    ),
    transports: [
        new winston.transports.Console(),    //どこに出力するかを決める。コンソール（ターミナル）に出力する。
        // new winston.transports.File({ filename: 'logfile.log' })
    ]
});

console.log("現在のログレベル:", process.env.LOG_LEVEL);

export default logger;