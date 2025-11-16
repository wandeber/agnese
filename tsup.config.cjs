const banner = `/*!
 * Agnese: configuration-driven data mapping.
 * @licence CC BY-ND 4.0
 * @author Bernardo Alemán Siverio (wandeber) <berthewanderer@gmail.com>
 */`;

const cjsFooter = `
if (typeof module !== "undefined" && module.exports) {
  const named = module.exports;
  const defaultExport = named.default ?? named.Agnese;
  if (defaultExport) {
    const descriptors = Object.getOwnPropertyDescriptors(named);
    for (const key of Object.keys(descriptors)) {
      if (key === "default") {
        continue;
      }
      Object.defineProperty(defaultExport, key, descriptors[key]);
    }
    defaultExport.default = defaultExport;
    module.exports = defaultExport;
  }
}
`;

module.exports = [
  {
    entry: {
      Agnese: "src/index.ts"
    },
    format: ["esm", "cjs"],
    outDir: "dist",
    dts: {
      entry: {
        Agnese: "src/index.ts"
      }
    },
    minify: true,
    sourcemap: true,
    platform: "node",
    target: "node18",
    bundle: true,
    splitting: false,
    clean: true,
    banner: {
      js: banner
    },
    tsconfig: "./tsconfig.json",
    skipNodeModulesBundle: true,
    outExtension({format}) {
      return {
        js: format === "cjs" ? ".cjs" : ".js"
      };
    },
    esbuildOptions(options) {
      if (options.format === "cjs") {
        options.footer = options.footer || {};
        options.footer.js = `${cjsFooter}`;
      }
    }
  }
];
