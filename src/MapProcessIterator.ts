import MapField, {FieldBase} from "./MapField";
import FieldValue from "./FieldValue";
import MapProcess from "./MapProcess";
import Agnese from "./Agnese";



export type MapProcessIteratorBase = {
  each: string;
  as?: string;
  keyName?: string;
  do?: FieldBase;
}


export default class MapProcessIterator implements MapProcessIteratorBase, MapProcess {
  each: string;

  as = "item";
  
  keyName = "key";
  
  do?: MapField;

  constructor(obj: MapProcessIteratorBase, public agnese: Agnese) {
    this.each = obj.each;

    if (obj.as !== undefined) {
      this.as = obj.as;
    }

    if (obj.keyName !== undefined) {
      this.keyName = obj.keyName;
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
    
    result = [];
    for (const index in iterable) {
      if (iterable.hasOwnProperty(index)) {
        let mergedDataSource: any = {
          source: {}
        };
        Object.assign(mergedDataSource.source, sourceData);
        mergedDataSource[this.keyName] = index;
        mergedDataSource[this.as] = iterable[index];
        if (this.do !== undefined) {
          let value = this.do.map(mergedDataSource);
          if (value !== undefined) {
            result.push(value);
          }
        }
      }
    } 
    return result;
  }
}
