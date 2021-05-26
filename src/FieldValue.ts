import ValueSwitch, {ValueSwitchBase} from "./ValueSwitch";
import MapProcess from "./MapProcess";
import Agnese from "./Agnese";
import { FieldType } from "./Types";



export type FieldValueBase = {
  type?: FieldType;
  default?: any;
  fromPath?: string;
  fromFirstPresentPath?: string[];
  fromConditionalPath?: ValueSwitchBase;
}

export interface ITyped {
  type?: FieldType;
  assureType(value: any): any;
}

export default class FieldValue implements FieldValueBase, MapProcess, ITyped {
  type?: FieldType;

  default?: any;

  fromPath?: string;

  fromFirstPresentPath?: string[];

  fromConditionalPath?: ValueSwitch;


  constructor(obj: FieldValueBase, public agnese: Agnese) {
    if (obj.type !== undefined) {
      this.type = obj.type;
    }

    if (obj.default !== undefined) {
      this.default = obj.default;
    }

    if (obj.fromPath !== undefined) {
      this.fromPath = obj.fromPath;
    }

    if (obj.fromFirstPresentPath !== undefined) {
      this.fromFirstPresentPath = obj.fromFirstPresentPath;
    }

    if (obj.fromConditionalPath !== undefined) {
      this.fromConditionalPath = new ValueSwitch(obj.fromConditionalPath, this.agnese);
    }
  }

  process(sourceData: any): any {
    // TODO: Force types.
    let result: any = this.default;
    let value: any;
    
    if (this.fromFirstPresentPath) {
      for (const fromPath of this.fromFirstPresentPath) {
        value = FieldValue.getValueFromPath(sourceData, fromPath);
        if (value !== undefined) {
          break;
        }
      }
    }
    else {
      let path: any;
      if (this.fromPath) {
        path = this.fromPath;
      }
      else if (this.fromConditionalPath) {
        path = this.fromConditionalPath.process(sourceData);
      }
      if (path) {
        value = FieldValue.getValueFromPath(sourceData, path);
      }
    }

    if (value !== undefined) {
      // TODO: Preprocessor in value?
      result = value;
    }

    result = this.assureType(result);

    return result;
  }

  static getValueFromPath(sourceData: any, path: string): any {
    let subpaths = path.split(".");
    let value = sourceData;
    //if (Array.isArray(subpaths)) { // Array to follow path to the value.
    for (let i = 0; i < subpaths.length; i++) {
      try {
        value = value[subpaths[i]];
      }
      catch {
        value = undefined;
        break;
      }
    }
    //}
    return value;
  }

  assureType(result: any) {
    return FieldValue.assureTypeTo(result, this.type);
  }

  static assureTypeTo(result: any, type?: FieldType) {
    if (result !== undefined && type !== undefined) {
      switch (type) {
        case FieldType.Integer: result = parseInt(result); break;
        case FieldType.Float:   result = parseFloat(result); break;
        case FieldType.Number:  result = parseFloat(result); break; // TODO: To integer if integer.
        case FieldType.Boolean: result = Boolean(result); break;
        case FieldType.String:  result = String(result); break;
        default: break;
      }
    }
    return result;
  }
}
