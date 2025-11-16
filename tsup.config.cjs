const tsupConfig = {
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  sourcemap: true,
  clean: true,
  dts: true,
  splitting: false,
  target: "node18",
  outDir: "dist",
  tsconfig: "./tsconfig.base.json",
  skipNodeModulesBundle: true,
  outExtension({format}) {
    return {
      js: format === "esm" ? ".mjs" : ".js"
    };
  }
};

module.exports = tsupConfig;
