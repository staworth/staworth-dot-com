#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const repoRoot = process.cwd();
const gitDir = path.join(repoRoot, ".git");
const hooksDir = path.join(repoRoot, ".githooks");

// Never configure local git hooks in CI/deploy environments.
if (process.env.CI || process.env.VERCEL) {
  process.exit(0);
}

if (!fs.existsSync(gitDir) || !fs.existsSync(hooksDir)) {
  process.exit(0);
}

const inWorkTree = spawnSync("git", ["rev-parse", "--is-inside-work-tree"], {
  cwd: repoRoot,
  encoding: "utf8",
});

if (inWorkTree.status !== 0 || inWorkTree.stdout.trim() !== "true") {
  process.exit(0);
}

const result = spawnSync("git", ["config", "core.hooksPath", ".githooks"], {
  cwd: repoRoot,
  stdio: "inherit",
});

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}
