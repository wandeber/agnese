const fs = require("fs");
const path = require("path");

const sandbox = process.argv[2];

if (!sandbox) {
  console.error("Sandbox name required (cjs | esm).");
  process.exit(1);
}

const rootDir = path.resolve(__dirname, "..");
const sandboxDir = path.resolve(rootDir, "sandbox/module-import", sandbox);

if (!fs.existsSync(sandboxDir)) {
  console.error(`Sandbox directory not found: ${sandboxDir}`);
  process.exit(1);
}

const distDir = path.resolve(rootDir, "dist");

if (!fs.existsSync(distDir)) {
  console.error("Build artifacts not found in dist/. Run npm run build first.");
  process.exit(1);
}

const nodeModulesDir = path.join(sandboxDir, "node_modules");
const packageTargetDir = path.join(nodeModulesDir, "agnese");

fs.rmSync(packageTargetDir, {recursive: true, force: true});
fs.mkdirSync(packageTargetDir, {recursive: true});

const copyOptions = {recursive: true};

fs.cpSync(distDir, path.join(packageTargetDir, "dist"), copyOptions);

const schemaDir = path.resolve(rootDir, "schema");
if (fs.existsSync(schemaDir)) {
  fs.cpSync(schemaDir, path.join(packageTargetDir, "schema"), copyOptions);
}

const licensePath = path.resolve(rootDir, "LICENSE");
if (fs.existsSync(licensePath)) {
  fs.copyFileSync(licensePath, path.join(packageTargetDir, "LICENSE"));
}

const readmePath = path.resolve(rootDir, "README.md");
if (fs.existsSync(readmePath)) {
  fs.copyFileSync(readmePath, path.join(packageTargetDir, "README.md"));
}

const rootPackagePath = path.resolve(rootDir, "package.json");
const packageJson = JSON.parse(fs.readFileSync(rootPackagePath, "utf8"));

const sandboxPackageJson = {
  name: "agnese",
  version: packageJson.version,
  type: packageJson.type,
  main: packageJson.main,
  module: packageJson.module,
  types: packageJson.types,
  exports: packageJson.exports,
  typesVersions: packageJson.typesVersions,
  license: packageJson.license
};

fs.writeFileSync(
  path.join(packageTargetDir, "package.json"),
  `${JSON.stringify(sandboxPackageJson, null, 2)}\n`
);

console.log(`Prepared sandbox '${sandbox}' with local build.`);

