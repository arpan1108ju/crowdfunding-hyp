// @ts-check
import { PrismaClient } from "@prisma/client";

// types/global.d.ts
/** @type {import('@prisma/client').PrismaClient} */
const db = new PrismaClient();

export default db;
