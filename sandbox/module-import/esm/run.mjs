import Agnese, {Agnese as NamedAgnese} from "agnese";

const success = typeof Agnese === "function" && typeof NamedAgnese === "function";

if (success) {
  console.log("[ESM] Agnese import OK");
}
else {
  console.log("[ESM] Agnese import FAILED");
}

process.exit(success ? 0 : 1);

