#!/usr/bin/env node

import fs from "fs";
import path from "path";

const targetDir = process.argv[2]
  ? path.resolve(process.argv[2])
  : process.cwd();

function buildTree(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  const dirs = [];
  const files = [];

  for (const entry of entries) {
    if (entry.isDirectory()) dirs.push(entry);
    else files.push(entry);
  }

  dirs.sort((a, b) => a.name.localeCompare(b.name));
  files.sort((a, b) => a.name.localeCompare(b.name));

  return [...dirs, ...files];
}

function renderTree(dir, prefix = "") {
  const entries = buildTree(dir);
  let output = "";

  entries.forEach((entry, index) => {
    const isLast = index === entries.length - 1;
    const connector = isLast ? "└── " : "├── ";
    output += prefix + connector + entry.name + "\n";

    if (entry.isDirectory()) {
      const nextPrefix = prefix + (isLast ? "    " : "│   ");
      const fullPath = path.join(dir, entry.name);
      output += renderTree(fullPath, nextPrefix);
    }
  });

  return output;
}

const rootName = path.basename(targetDir);

let result = rootName + "/\n";
result += renderTree(targetDir);

process.stdout.write(result);
