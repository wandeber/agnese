const Quara = require("../other-dependencies/quara").default;
import Agnese from "./Agnese";
import FieldValue, {FieldValueBase} from "./FieldValue";
import MapProcess from "./MapProcess";



export type ProcessIfBase = {
  exists?: string;
  quara?: string;
  value?: FieldValueBase;
}


export default class ProcessIf implements ProcessIfBase, MapProcess {
  exists?: string;

  quara?: string;

  value?: FieldValue;

  constructor(obj: ProcessIfBase, public agnese: Agnese) {
    if (obj.exists !== undefined) {
      this.exists = obj.exists;
    }

    if (obj.quara !== undefined) {
      this.quara = obj.quara;
    }

    if (obj.value !== undefined) {
      this.value = new FieldValue(obj.value, this.agnese);
    }
  }

  process(sourceData: any): boolean {
    if (this.exists) {
      return FieldValue.getValueFromPath(sourceData, this.exists);
    }
    else if (this.quara) {
      return new Quara(this.quara, sourceData).run();
    }
    else if (this.value) {
      return this.value.process(sourceData);
    }
    return false; // TODO: Think about this default return.
  }
}
