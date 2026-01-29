import { PrismaClient } from "../src/generated/prisma/client";
const prisma = new PrismaClient();

async function main() {
  // 既存データを消す
  await prisma.transaction.deleteMany();

  await prisma.transaction.createMany({
    data: [
      {
        date: new Date("2025-11-01"),
        type: "収入",
        amount: 50000,
        memo: "給与",
      },
      {
        date: new Date("2025-11-02"),
        type: "支出",
        amount: 1200,
        memo: "ランチ",
      },
      {
        date: new Date("2025-11-03"),
        type: "支出",
        amount: 500,
        memo: "チョコ",
      },
      {
        date: new Date("2025-11-03"),
        type: "支出",
        amount: 800,
        memo: "ウィンナー",
      },
      {
        date: new Date("2025-11-03"),
        type: "支出",
        amount: 500,
        memo: "トマト",
      },
      {
        date: new Date("2025-11-03"),
        type: "支出",
        amount: 1400,
        memo: "はちみつ",
      },
      {
        date: new Date("2025-11-05"),
        type: "支出",
        amount: 50,
        memo: "駄菓子",
      },
    ],
  });

  console.log("🌱 Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });