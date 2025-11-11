import FieldValue, {ITyped} from "./FieldValue.js";
import MapField, {FieldBase} from "./MapField.js";
import Agnese from "./Agnese.js";
import {FieldType} from "./Types.js";
import MapProcess from "./MapProcess.js";
// @ts-expect-error: quara has no TypeScript declarations
import {Quara} from "quara";





export interface MapProcessIteratorBase extends ITyped {
  each: string;
  as?: string;
  keyName?: string;
  targetKeyName?: string;
  do?: FieldBase;
}


export default class MapProcessIterator implements MapProcessIteratorBase, MapProcess {
  type: FieldType = FieldType.Array;

  each: string;

  as = "item";
  
  keyName = "key";

  targetKeyName = "key"; // Evaluated by Quara.
  
  do?: MapField;

  constructor(obj: MapProcessIteratorBase, public agnese: Agnese) {
    this.each = obj.each;

    if (obj.type !== undefined) {
      this.type = obj.type;
    }

    if (obj.as !== undefined) {
      this.as = obj.as;
    }

    if (obj.keyName !== undefined) {
      this.keyName = obj.keyName;
    }

    if (obj.targetKeyName !== undefined) {
      this.targetKeyName = obj.targetKeyName;
    }

    if (obj.do !== undefined) {
      this.do = new MapField(obj.do, this.agnese);
    }
  }

  process(sourceData: any): any {
    let result: any;
    const iterable = FieldValue.getValueFromPath(sourceData, this.each);
    
    if (!iterable || typeof iterable[Symbol.iterator] !== "function") {
      return result;
    }
    
    result = this.initializeResult();

    for (let i in iterable) {
      if (iterable.hasOwnProperty(i)) {
        let index: string|number = i;
        let mergedDataSource: any = {
          source: {}
        };

        if (!isNaN(index as unknown as number)) {
          index = Number(index);
        }

        Object.assign(mergedDataSource.source, sourceData);
        mergedDataSource[this.keyName] = index;
        mergedDataSource[this.as] = iterable[index];
        let value;
        if (this.do !== undefined && (value = this.do.map(mergedDataSource)) !== undefined) {
          if (this.type === FieldType.Object) {
            let propName = new Quara(this.targetKeyName, mergedDataSource).run();
            result[propName] = value;
          }
          else if (this.type === FieldType.Array) {
            result.push(value);
          }
          else {
            result += value;
          }
        }
      }
    }

    if (result !== undefined) {
      result = this.assureType(result);
    }

    return result;
  }

  initializeResult(): any {
    let result: any;
    if (this.type === FieldType.Object) {
      result = {};
    }
    else if (this.type === FieldType.Array) {
      result = [];
    }
    else if (this.type === FieldType.String) {
      result = "";
    }
    else {
      result = 0;
    }
    return result;
  }

  assureType(result: any) {
    return FieldValue.assureTypeTo(result, this.type);
  }
}
