import FieldValue, {FieldValueBase} from "./FieldValue.js";
import Agnese from "./Agnese.js";
import {AnyFunction} from "./PreprocessorManager.js";



export interface PreprocessorBase {
  name?: string;
  args?: FieldValueBase[];
  fn?: AnyFunction|null;
}

export interface PreprocessableBase {
  preprocessor?: PreprocessorBase;
}



export class Preprocessor implements PreprocessorBase {
  name?: string;

  args?: FieldValue[];
  
  fn: AnyFunction|null = null;


  constructor(protected obj: any, public agnese: Agnese) {
    if (typeof obj.fn === "function") {
      this.fn = obj.fn;
    }
    else if (obj.name !== undefined) {
      this.name = obj.name;
    }
    else {
      throw new Error("[Agnese] Preprocessor (preprocessor): must have a name or a function (in fn).");
    }

    //this.getPreprocessor();

    if (Array.isArray(obj.args)) {
      this.args = obj.args.map((arg: any) => new FieldValue(arg, this.agnese));
    }
  }

  getPreprocessor(): AnyFunction|null {
    if (typeof this.fn === "function") {
      return this.fn;
    }

    if (typeof this.name === "string") {
      if (this.agnese.preprocessorManager) {
        this.fn = this.agnese.preprocessorManager.getPreprocessor(this.name);
      }
      //throw new Error("[Agnese] Preprocessor (preprocessor): preprocessorManager is not defined.");
    }

    return this.fn;
  }

  getArguments(sourceData?: any): any[] {
    let result: any[] = [];
    if (Array.isArray(this.args)) {
      result = this.args.map((arg: FieldValue) => arg.process(sourceData));
    }
    return result;
  }

  process(sourceData?: any, value?: any) {
    let result = value;

    // To allow defining map info before preprocessor manager.
    this.getPreprocessor();
    

    // If a preprocessor is defined, it will be used in any case.
    if (typeof this.fn === "function") {
      let args = [];
      args.push(value);
      if (this.args) {
        args.push(...this.getArguments(sourceData));
      }
      result = this.fn(sourceData, ...args);
    }
    else {
      console.warn("[Agnese] Preprocessor (preprocessor): in version 1.0.0 preprocessor could throw an error if it's pointing to non existing function.");
    }
    return result;
  }
}



export default class Preprocessable implements PreprocessableBase {
  preprocessor?: Preprocessor;

  constructor(obj: any, public agnese: Agnese) {
    if (obj.preprocessor !== undefined) {
      this.preprocessor = new Preprocessor(obj.preprocessor, this.agnese);
    }
  }

  preprocess(sourceData?: any, value?: any) {
    // If a preprocessor is defined, it will be used in any case.
    if (this.preprocessor) {
      value = this.preprocessor.process(sourceData, value);
    }
    return value;
  }
}
