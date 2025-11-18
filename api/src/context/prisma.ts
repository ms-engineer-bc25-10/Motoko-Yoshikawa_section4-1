import { PrismaClient } from '../generated/prisma/client'; //Prisma インスタンス共有。client.ts（Prisma が自動生成するファイル）を使っているだけ。プロジェクト全体で 1つの PrismaClient を共有するためのファイル。

export const prisma = new PrismaClient(); // PrismaClient を new して全体で使い回す
