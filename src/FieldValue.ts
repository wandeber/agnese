import ValueSwitch, {ValueSwitchBase} from "./ValueSwitch";
import MapProcess from "./MapProcess";
import Agnese from "./Agnese";



export type FieldValueBase = {
  type?: string;
  default?: any;
  fromPath?: string;
  fromFirstPresentPath?: string[];
  fromConditionalPath?: ValueSwitchBase;
}


export default class FieldValue implements FieldValueBase, MapProcess {
  type?: string;

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

    return result;
  }

  static getValueFromPath(sourceData: any, path: any): any {
    path = path.split(".");
    let value = sourceData;
    if (Array.isArray(path)) { // Array to follow path to the value.
      for (let i = 0; i < path.length; i++) {
        if (value === null) {
          break;
        }

        if (value === undefined) {
          break;
        }

        if (value[path[i]] === undefined) {
          value = undefined;
          break;
        }
        
        if (typeof value === "object") {
          value = value[path[i]];
        }
        //else { // Value if the path doesn"t exist.
        //  value = "ERROR";
        //  break;
        //}
      }
    }
    return value;
  }
}
