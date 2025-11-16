#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const {spawnSync} = require("child_process");

const projectRoot = path.resolve(__dirname, "..");
const distDir = path.join(projectRoot, "dist");
const tsupConfig = require(path.join(projectRoot, "tsup.config.cjs"));
const tscBin = path.join(projectRoot, "node_modules", ".bin", "tsc");

function runCommand(command, args) {
  const result = spawnSync(command, args, {
    cwd: projectRoot,
    stdio: "inherit",
    env: process.env
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function runTscBuild(projectPath) {
  runCommand(tscBin, ["-p", projectPath]);
}

function ensureDir(targetPath) {
  fs.mkdirSync(path.dirname(targetPath), {recursive: true});
}

function copyDirContents(sourceDir, targetDir, {mapFileName} = {}) {
  if (!fs.existsSync(sourceDir)) {
    throw new Error(`Expected build output at ${sourceDir} was not found.`);
  }

  for (const entry of fs.readdirSync(sourceDir, {withFileTypes: true})) {
    const sourcePath = path.join(sourceDir, entry.name);
    if (entry.isDirectory()) {
      copyDirContents(sourcePath, path.join(targetDir, entry.name), {mapFileName});
      continue;
    }

    const destinationName = typeof mapFileName === "function" ? mapFileName(entry.name) : entry.name;
    const destinationPath = path.join(targetDir, destinationName);
    ensureDir(destinationPath);
    fs.copyFileSync(sourcePath, destinationPath);
  }
}

function copyArtifact(source, target) {
  if (!fs.existsSync(source)) {
    throw new Error(`Expected build artifact at ${source} was not found.`);
  }
  ensureDir(target);
  fs.copyFileSync(source, target);
}

function esmFileName(name) {
  if (name.endsWith(".js.map")) {
    return `${name.slice(0, -6)}.mjs.map`;
  }
  if (name.endsWith(".js")) {
    return `${name.slice(0, -3)}.mjs`;
  }
  return name;
}

function rewriteEsmImports(targetDir) {
  for (const entry of fs.readdirSync(targetDir, {withFileTypes: true})) {
    const entryPath = path.join(targetDir, entry.name);
    if (entry.isDirectory()) {
      rewriteEsmImports(entryPath);
      continue;
    }

    if (!entry.name.endsWith(".mjs")) {
      continue;
    }

    const fileContents = fs.readFileSync(entryPath, "utf8");
    let updated = fileContents.replace(/(["'])(\.\.\/|\.\/)([^"']+?)\.js\1/g, (match, quote, prefix, specifier) => {
      return `${quote}${prefix}${specifier}.mjs${quote}`;
    });
    updated = updated.replace(/sourceMappingURL=([^\s]+?)\.js\.map/g, (match, specifier) => {
      return `sourceMappingURL=${specifier}.mjs.map`;
    });

    fs.writeFileSync(entryPath, updated);
  }
}

function runFallbackBuild() {
  console.warn("tsup is not available; falling back to a TypeScript-only build.");
  fs.rmSync(distDir, {recursive: true, force: true});

  runTscBuild("tsconfig.cjs.json");
  runTscBuild("tsconfig.esm.json");

  copyDirContents(path.join(distDir, "cjs"), distDir);
  copyDirContents(path.join(distDir, "esm"), distDir, {mapFileName: esmFileName});
  rewriteEsmImports(distDir);
  copyArtifact(path.join(distDir, "types", "index.d.ts"), path.join(distDir, "index.d.ts"));
}

async function runBuild() {
  try {
    const tsup = await import("tsup");
    await tsup.build(tsupConfig);
    return;
  } catch (error) {
    if (error && (error.code === "ERR_MODULE_NOT_FOUND" || error.code === "MODULE_NOT_FOUND") && String(error.message).includes("'tsup'")) {
      runFallbackBuild();
      return;
    }
    throw error;
  }
}

runBuild().catch((error) => {
  console.error(error);
  process.exit(1);
});

