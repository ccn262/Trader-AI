import { readFile, readdir } from "node:fs/promises";
import { join, relative, resolve } from "node:path";

const projectRoot = process.cwd();
const sourceRoots = ["src"];
const bannedImports = [
  "@/lib/supabase/server",
  "@/lib/scanning/run-scan",
  "@/lib/scanning/auth",
  "@/lib/ingestion/rns",
];
const secretNames = [
  "SUPABASE_SERVICE_ROLE_KEY",
  "TRADER_AI_ADMIN_SECRET",
  "CRON_SECRET",
];

async function walkFiles(rootDir, files = []) {
  const entries = await readdir(rootDir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(rootDir, entry.name);
    if (entry.isDirectory()) {
      await walkFiles(fullPath, files);
      continue;
    }
    if (/\.(tsx?|mts|cts|js|mjs|cjs)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

function isClientFile(source) {
  return /^\s*["']use client["'];?/m.test(source);
}

async function main() {
  const files = [];
  for (const root of sourceRoots) {
    await walkFiles(resolve(projectRoot, root), files);
  }

  const violations = [];

  for (const file of files) {
    const source = await readFile(file, "utf8");
    if (!isClientFile(source)) {
      continue;
    }

    for (const importPath of bannedImports) {
      if (source.includes(importPath)) {
        violations.push(
          `${relative(projectRoot, file)} imports ${importPath} from a client component`,
        );
      }
    }

    for (const secretName of secretNames) {
      if (source.includes(secretName)) {
        violations.push(
          `${relative(projectRoot, file)} references ${secretName} from a client component`,
        );
      }
    }
  }

  if (violations.length > 0) {
    console.error("Server boundary violations detected:");
    for (const violation of violations) {
      console.error(`- ${violation}`);
    }
    process.exit(1);
  }

  console.log("Server boundary check passed: no client component imports of server-secret modules found.");
}

main().catch((error) => {
  console.error("Server boundary check failed:", error);
  process.exit(1);
});
