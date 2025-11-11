const agneseImport = require("agnese");

const hasDefault = typeof agneseImport === "function";
const hasNamed = typeof agneseImport.Agnese === "function";
const hasDefaultProp = typeof agneseImport.default === "function";

const success = hasDefault && hasNamed && hasDefaultProp;

/* eslint-disable no-console */
if (success) {
  console.log("[CJS] Agnese import OK");
}
else {
  console.log("[CJS] Agnese import FAILED");
}
/* eslint-enable no-console */

process.exit(success ? 0 : 1);

