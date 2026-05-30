import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.resolve(__dirname, "..", "src");

async function getJavaScriptFiles(dirPath) {
  const dirents = await readdir(dirPath, { withFileTypes: true });
  const nested = await Promise.all(
    dirents.map(async (dirent) => {
      const fullPath = path.join(dirPath, dirent.name);

      if (dirent.isDirectory()) {
        return getJavaScriptFiles(fullPath);
      }

      return fullPath.endsWith(".js") ? [fullPath] : [];
    })
  );

  return nested.flat();
}

async function validateFileSyntax(filePath) {
  await readFile(filePath, "utf8");

  await new Promise((resolve, reject) => {
    const checker = spawn(process.execPath, ["--check", filePath], {
      stdio: "pipe",
    });

    let stderr = "";
    checker.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    checker.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(
        new Error(
          `Syntax check failed for ${filePath}${stderr ? `\n${stderr}` : ""}`
        )
      );
    });
  });
}

async function run() {
  const files = await getJavaScriptFiles(srcDir);

  if (files.length === 0) {
    throw new Error(`No JavaScript files found in ${srcDir}`);
  }

  await Promise.all(files.map((filePath) => validateFileSyntax(filePath)));

  console.log(`Backend build validation passed for ${files.length} files.`);
}

run().catch((error) => {
  console.error("Backend build validation failed.");
  console.error(error);
  process.exit(1);
});
