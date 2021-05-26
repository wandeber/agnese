import MapField, {FieldBase} from "./MapField";
import FieldValue, {ITyped} from "./FieldValue";
import MapProcess from "./MapProcess";
import Agnese from "./Agnese";
import { FieldType } from "./Types";
const Quara = require("../other-dependencies/quara").default;





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

  targetKeyName: string = "key"; // Evaluated by Quara.
  
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
        if (this.do !== undefined) {
          let value = this.do.map(mergedDataSource);
          if (value !== undefined) {
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
