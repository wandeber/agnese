// Using .js extension preserves compatibility with NodeNext resolution.
import Agnese from "./Agnese.js";

export default Agnese;
export {Agnese};

/**
 * Preserve legacy CommonJS consumption (`require("agnese")`).
 */
if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
  module.exports = Agnese;
  module.exports.default = Agnese;
  module.exports.Agnese = Agnese;
}
