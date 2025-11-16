import FieldValue, {FieldValueBase, ITyped} from "./FieldValue.js";
import MapProcessIterator, {MapProcessIteratorBase} from "./MapProcessIterator.js";
import Preprocessable, {PreprocessableBase} from "./Preprocessable.js";
import ProcessIf, {ProcessIfBase} from "./ProcessIf.js";
import Agnese from "./Agnese.js";
import {FieldType} from "./Types.js";



export interface ItemBase extends PreprocessableBase, ITyped {
  fields?: ItemBase[];
  items?: ItemBase[];
  if?: ProcessIfBase;
  iterate?: MapProcessIteratorBase;
  value?: FieldValueBase;
  allowEmpty?: boolean;
}

export interface FieldBase extends ItemBase {
  name?: string;
}



export class MapItem extends Preprocessable implements ItemBase {
  type?: FieldType;

  fields?: MapField[];

  items?: MapField[];

  if?: ProcessIf;

  iterate?: MapProcessIterator;

  value?: FieldValue;

  /**
   * Allow or not empty values "", {} and [].
   * @type boolean
   */
  allowEmpty? = true;


  constructor(obj: ItemBase, public agnese: Agnese) {
    super(obj, agnese);
    
    if (obj.type !== undefined) {
      this.type = obj.type as FieldType;
    }
    
    if (obj.allowEmpty !== undefined) {
      this.allowEmpty = obj.allowEmpty;
    }

    if (Array.isArray(obj.fields)) {
      this.fields = [];
      for (const mapField of obj.fields) {
        this.fields.push(new MapField(mapField, this.agnese));
      }
    }

    if (Array.isArray(obj.items)) {
      this.items = [];
      for (const mapItem of obj.items) {
        this.items.push(new MapItem(mapItem, this.agnese));
      }
    }
    
    if (obj.if !== undefined) {
      this.if = new ProcessIf(obj.if, this.agnese);
    }

    if (obj.value !== undefined) {
      this.value = new FieldValue(obj.value, this.agnese);
    }

    if (obj.iterate !== undefined) {
      this.iterate = new MapProcessIterator(obj.iterate, this.agnese);
    }
  }

  map(sourceData: any): any {
    // If filed "if" exists, its condition must be true or this field will be ignored.
    if (this.if !== undefined && !this.if.process(sourceData)) { // TODO: Evaluar if con Quara.
      return undefined;
    }

    let result: any;
    if (this.type === FieldType.Object && Array.isArray(this.fields)) {
      result = this.mapObject(sourceData);
    }
    else if (this.type === FieldType.Array && Array.isArray(this.items)) {
      result = this.mapArray(sourceData);
    }
    else if (this.type === FieldType.String && Array.isArray(this.items)) {
      result = this.mapString(sourceData);
    }
    
    // If "fields" doesn't exist...
    if (result === undefined) {
      if (this.iterate) {
        result = this.iterate.process(sourceData);
      }
      else if (this.value) {
        result = this.value.process(sourceData);
      }
    }
    
    result = this.preprocess(sourceData, result);

    // Force desired type:
    result = this.assureType(result);

    return result;
  }

  assureType(result: any) {
    return FieldValue.assureTypeTo(result, this.type);
  }

  private mapArray(sourceData: any): any[]|undefined {
    //console.log("MapCompound.mapArray");
    let result: any = [];
    if (this.items && this.items[Symbol.iterator]) {
      for (const item of this.items) {
        let value = item.map(sourceData);
        if (value != undefined) {
          result.push(value);
        }
      }
    }
    if (result.length <= 0 && !this.allowEmpty) {
      result = undefined;
    }
    return result;
  }

  private mapString(sourceData: any): string|undefined {
    //console.log("MapCompound.mapArray");
    let result: string|undefined = "";
    if (this.items && this.items[Symbol.iterator]) {
      for (const item of this.items) {
        let value = item.map(sourceData);
        if (value != undefined) {
          result += value;
        }
      }
    }
    if (result === "" && !this.allowEmpty) {
      result = undefined;
    }
    return result;
  }

  private mapObject(sourceData: any): any {
    //console.log("MapCompound.mapObject");
    let result: any = {};
    if (this.fields && this.fields[Symbol.iterator]) {
      for (const field of this.fields) {
        if (field.name) {
          let value = field.map(sourceData);
          if (value != undefined) {
            result[field.name] = value;
          }
        }
      }
    }
    if (Object.keys(result).length <= 0 && !this.allowEmpty) {
      result = undefined;
    }
    return result;
  }
}



export default class MapField extends MapItem implements FieldBase {
  name?: string;

  constructor(obj: FieldBase, public agnese: Agnese) {
    super(obj, agnese);

    if (obj.name !== undefined) {
      this.name = obj.name;
    }
  }
}
