import ProcessIf, {ProcessIfBase} from "./ProcessIf";
import MapProcess from "./MapProcess";
import Agnese from "./Agnese";



export type ConditionalValueBase = {
  if?: ProcessIfBase;
  result: any;
}


export type ValueSwitchBase = {
  conditions?: ConditionalValueBase[];
}


export class ConditionalValue implements ConditionalValueBase {
  public if?: ProcessIf;

  public result: any;

  constructor(obj: ConditionalValueBase, public agnese: Agnese) {
    if (obj.if !== undefined) {
      this.if = obj.if as ProcessIf;
    }

    if (obj.result !== undefined) {
      this.result = obj.result;
    }
  }
}


export default class ValueSwitch implements ValueSwitchBase, MapProcess {
  public conditions?: ConditionalValue[];

  constructor(obj: ValueSwitchBase, public agnese: Agnese) {
    if (Array.isArray(obj.conditions)) {
      this.conditions = [];
      for (const condition of obj.conditions) {
        this.conditions.push(new ConditionalValue(condition, this.agnese));
      }
    }
  }

  public process(): boolean {
    return true;
  }
}
