import { PrismaClient } from "@prisma/client";

import { syncCurriculum } from "~/content/curriculum/sync";

const args = new Set(process.argv.slice(2));
async function main() {
  if (args.has("--help")) {
    process.stdout.write(
      "Usage: pnpm curriculum:sync [--dry-run | --apply] [--adopt-legacy]\n"
    );
    return;
  }
  if (args.has("--dry-run") && args.has("--apply")) {
    throw new Error("Choose one of --dry-run or --apply");
  }
  const unknown = [...args].filter((arg) => arg !== "--dry-run" && arg !== "--apply" && arg !== "--adopt-legacy");
  if (unknown.length > 0) throw new Error(`Unknown option: ${unknown.join(", ")}`);

  const prisma = new PrismaClient();
  try {
    const report = await syncCurriculum({
      prisma,
      apply: args.has("--apply"),
      dryRun: !args.has("--apply"),
      adoptLegacy: args.has("--adopt-legacy"),
    });
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  } finally {
    await prisma.$disconnect();
  }
}

void main();
