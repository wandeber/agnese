import FieldValue, {FieldValueBase} from "./FieldValue";
import Agnese from "./Agnese";
import {AnyFunction} from "./PreprocessorManager";



export interface PreprocessorBase {
  name?: string;
  args?: FieldValueBase[];
}

export interface PreprocessableBase {
  preprocessor?: PreprocessorBase;
}



export class Preprocessor implements PreprocessorBase {
  name?: string;

  args?: FieldValue[];
  
  fn: AnyFunction|null = null;


  constructor(obj: any, public agnese: Agnese) {
    if (obj.name !== undefined) {
      this.name = obj.name;
    }
    if (Array.isArray(obj.args)) {
      this.args = obj.args.map((arg: any) => new FieldValue(arg, this.agnese));
    }
  }

  getPreprocessor(): AnyFunction|null {
    if (
      typeof this.fn !== "function"
      && this.agnese?.preprocessorManager
      && typeof this.name === "string"
    ) {
      this.fn = this.agnese.preprocessorManager.getPreprocessor(this.name);
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
    let result: any;
    // If a preprocessor is defined, it will be used in any case.
    if (this.getPreprocessor() && typeof this.fn === "function") {
      let args = [];
      if (value) {
        args.push(value);
      }
      if (this.args) {
        args.push(...this.getArguments(sourceData));
      }
      result = this.fn(sourceData, ...args);
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
