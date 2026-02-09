#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const privacyPolicyPath = path.join(process.cwd(), "src/content/privacy-policy.md");

if (!fs.existsSync(privacyPolicyPath)) {
  process.exit(0);
}

const content = fs.readFileSync(privacyPolicyPath, "utf8");
const now = new Date();
const isoDate = [
  now.getFullYear(),
  String(now.getMonth() + 1).padStart(2, "0"),
  String(now.getDate()).padStart(2, "0"),
].join("-");
const humanDate = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
}).format(now);

let next = content;

if (next.startsWith("---")) {
  const lines = next.split("\n");
  const endIndex = lines.findIndex((line, index) => index > 0 && line.trim() === "---");

  if (endIndex > 0) {
    const frontmatterLines = lines.slice(1, endIndex);
    const dateIndex = frontmatterLines.findIndex((line) => /^date:\s*/.test(line));

    if (dateIndex >= 0) {
      frontmatterLines[dateIndex] = `date: ${isoDate}`;
    } else {
      frontmatterLines.push(`date: ${isoDate}`);
    }

    next = [
      lines[0],
      ...frontmatterLines,
      lines[endIndex],
      ...lines.slice(endIndex + 1),
    ].join("\n");
  }
}

// Keep visible policy date in sync.
next = next.replace(/^Last updated:\s*.*$/m, `Last updated: ${humanDate}.`);

if (next !== content) {
  fs.writeFileSync(privacyPolicyPath, next, "utf8");
  console.log(`Updated privacy policy date to ${isoDate}`);
}
