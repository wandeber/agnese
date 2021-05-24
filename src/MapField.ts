import FieldValue, {FieldValueBase} from "./FieldValue";
import MapProcessIterator, {MapProcessIteratorBase} from "./MapProcessIterator";
import ProcessIf, {ProcessIfBase} from "./ProcessIf";
import {FieldType} from "./Types";
import {Preprocessable} from "./PreprocessorManager";



export interface ItemBase {
  type?: FieldType;
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
  public type?: FieldType;

  public fields?: MapField[];

  public items?: MapField[];

  public if?: ProcessIf;

  public iterate?: MapProcessIterator;

  public value?: FieldValue;

  /**
   * Allow or not empty values "", {} and [].
   * @type boolean
   */
   public allowEmpty? = true;


  constructor(obj: ItemBase) {
    super(obj);
    
    if (obj.type !== undefined) {
      this.type = obj.type as FieldType;
    }
    
    if (obj.allowEmpty !== undefined) {
      this.allowEmpty = obj.allowEmpty;
    }

    if (Array.isArray(obj.fields)) {
      this.fields = [];
      for (const mapField of obj.fields) {
        this.fields.push(new MapField(mapField));
      }
    }

    if (Array.isArray(obj.items)) {
      this.items = [];
      for (const mapItem of obj.items) {
        this.items.push(new MapItem(mapItem));
      }
    }
    
    if (obj.if !== undefined) {
      this.if = new ProcessIf(obj.if);
    }

    if (obj.value !== undefined) {
      this.value = new FieldValue(obj.value);
    }

    if (obj.iterate !== undefined) {
      this.iterate = new MapProcessIterator(obj.iterate);
    }
  }

  public map(sourceData: any): any {
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
    
    // If a preprocessor is defined, it will be used in any case.
    if (this.getPreprocessor() && typeof this.preprocessorFn === "function") {
      //let extraArguments = this.getPreprocessorExtraArguments(mapFieldInfo.preprocessor);
      result = this.preprocessorFn(result/*, ...extraArguments*/);
    }

    // Force desired type:
    if (result != undefined) {
      switch (this.type) {
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
  public name?: string;

  constructor(obj: FieldBase) {
    super(obj);

    if (obj.name !== undefined) {
      this.name = obj.name;
    }
  }
}
