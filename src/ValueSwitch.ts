import FieldValue, {FieldValueBase} from "./FieldValue";
import ProcessIf, {ProcessIfBase} from "./ProcessIf";
import Agnese from "./Agnese";
import MapProcess from "./MapProcess";



export type SwitchBranchBase = {
  if?: ProcessIfBase;
  result?: any;
  value?: FieldValueBase;
}


export type ValueSwitchBase = {
  /**
   * @deprecated branches will be removed in version 1.0.0. Use cases instead.
   */
  branches?: SwitchBranchBase[];
  cases?: SwitchBranchBase[];
}


export class SwitchBranch implements SwitchBranchBase {
  if?: ProcessIf;

  result?: any;

  value?: FieldValue;

  constructor(obj: SwitchBranchBase, public agnese: Agnese) {
    if (obj.if !== undefined) {
      this.if = new ProcessIf(obj.if, agnese);
    }

    if (obj.result !== undefined) {
      this.result = obj.result;
    }

    if (obj.value !== undefined) {
      this.value = new FieldValue(obj.value, this.agnese);
    }
  }

  process(sourceData: any): any {
    let result: any;
    if (this.if === undefined || this.if.process(sourceData)) {
      if (this.result !== undefined) {
        result = this.result;
      }
      else if (this.value !== undefined) {
        result = this.value.process(sourceData);
      }
    }
    return result;
  }
}


export default class ValueSwitch implements ValueSwitchBase, MapProcess {
  /**
   * @deprecated branches will be removed in version 1.0.0. Use cases instead.
   */
  branches?: SwitchBranch[];

  cases?: SwitchBranch[];

  constructor(obj: ValueSwitchBase, public agnese: Agnese) {
    if (Array.isArray(obj.branches) && !obj.cases) {
      //console.warn("[Agnese] ValueSwitch (switch): branches will be removed in version 1.0.0. Use cases instead.");
      obj.cases = obj.branches;
    }
    if (Array.isArray(obj.cases)) {
      this.cases = [];
      for (const condition of obj.cases) {
        this.cases.push(new SwitchBranch(condition, this.agnese));
      }
    }
    else {
      throw new Error("[Agnese] ValueSwitch (switch): cases must be an array.");
    }
  }

  process(sourceData: any): any {
    let result: any;
    if (Array.isArray(this.cases)) {
      for (const branch of this.cases) {
        result = branch.process(sourceData);
        if (result !== undefined) {
          return result;
        }
      }
    }
    return result;
  }
}
