import Agnese from "./Agnese";
import {AnyFunction} from "./PreprocessorManager";


export interface PreprocessorBase {
  name?: string;
}

export interface PreprocessableBase {
  preprocessor?: PreprocessorBase;
}



export class Preprocessor implements PreprocessorBase {
  name?: string;

  fn: AnyFunction|null = null;


  constructor(obj: any, public agnese: Agnese) {
    if (obj.name !== undefined) {
      this.name = obj.name;
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

  process(sourceData?: any, value?: any) {
    // If a preprocessor is defined, it will be used in any case.
    if (this.getPreprocessor() && typeof this.fn === "function") {
      //let extraArguments = this.getPreprocessorExtraArguments(mapFieldInfo.preprocessor);
      value = this.fn(sourceData, value/*, ...extraArguments*/);
    }
    return value;
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
      //let extraArguments = this.getPreprocessorExtraArguments(mapFieldInfo.preprocessor);
      value = this.preprocessor.process(sourceData, value/*, ...extraArguments*/);
    }
    return value;
  }
}
