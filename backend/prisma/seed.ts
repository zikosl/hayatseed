import { writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const seedSummary = {
  users: ["admin@hayatseed.dz", "client@hayatseed.dz"],
  products: 3,
  services: 6,
};

mkdirSync(resolve(process.cwd(), "prisma", "generated"), { recursive: true });
writeFileSync(
  resolve(process.cwd(), "prisma", "generated", "seed-summary.json"),
  JSON.stringify(seedSummary, null, 2),
);
