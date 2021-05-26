import ProcessIf, {ProcessIfBase} from "./ProcessIf";
import MapProcess from "./MapProcess";
import Agnese from "./Agnese";



export type SwitchBranchBase = {
  if?: ProcessIfBase;
  result: any;
}


export type ValueSwitchBase = {
  branches?: SwitchBranchBase[];
}


export class SwitchBranch implements SwitchBranchBase {
  if?: ProcessIf;

  result: any;

  constructor(obj: SwitchBranchBase, public agnese: Agnese) {
    if (obj.if !== undefined) {
      this.if = new ProcessIf(obj.if, agnese);
    }

    if (obj.result !== undefined) {
      this.result = obj.result;
    }
  }

  process(sourceData: any): any {
    let result: any;
    if (this.if === undefined || this.if.process(sourceData)) {
      result = this.result;
    }
    return result;
  }
}


export default class ValueSwitch implements ValueSwitchBase, MapProcess {
  branches?: SwitchBranch[];

  constructor(obj: ValueSwitchBase, public agnese: Agnese) {
    if (Array.isArray(obj.branches)) {
      this.branches = [];
      for (const condition of obj.branches) {
        this.branches.push(new SwitchBranch(condition, this.agnese));
      }
    }
  }

  process(sourceData: any): any {
    let result: any;
    if (Array.isArray(this.branches)) {
      for (const branch of this.branches) {
        result = branch.process(sourceData);
        if (result !== undefined) {
          return result;
        }
      }
    }
    return result;
  }
}
