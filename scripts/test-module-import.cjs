const path = require("path");
const {spawnSync} = require("child_process");

const rootDir = path.resolve(__dirname, "..");

function runCommand(command, args, options = {}) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    ...options
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

runCommand("npm", ["run", "build"], {cwd: rootDir});

const sandboxes = ["cjs", "esm"];

for (const sandbox of sandboxes) {
  runCommand("node", [path.join("scripts", "prepare-sandbox.cjs"), sandbox], {
    cwd: rootDir
  });

  const sandboxDir = path.join(rootDir, "sandbox/module-import", sandbox);
  const scriptFile = sandbox === "cjs" ? "run.cjs" : "run.mjs";

  runCommand("node", [scriptFile], {cwd: sandboxDir});
}

console.log("Module import tests completed successfully.");

