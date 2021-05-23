type AnyFunction = (...args: any) => any;

export default class PreprocessorManager {
  static preprocessors: any;

  public static getPreprocessor(preprocessor: any): AnyFunction|null {
    let fn = null;
    
    let name;
    if (typeof preprocessor === "string") {
      name = preprocessor;
    }
    else if (typeof preprocessor === "object") {
      if (typeof preprocessor.name === "string") {
        name = preprocessor;
      }
      else {
        console.log("preprocessor is an object without 'name' property");
      }
    }

    if (this.preprocessors) {
      if (this.preprocessors.constructor && typeof this.preprocessors.constructor[name] === "function") {
        fn = this.preprocessors.constructor[name];
      }
      else if (typeof this.preprocessors[name] === "function") {
        fn = this.preprocessors[name];
      }
    }

    return fn;
  }

  public static addPreprocessor(name: string, preprocessor: AnyFunction) {
    this.preprocessors[name] = preprocessor;
  }

  public static setPreprocessors(preprocessors: any) {
    this.preprocessors = preprocessors;
  }
}



export class Preprocessable {
  public preprocessor?: string;

  protected preprocessorFn?: AnyFunction|null;

  constructor(obj: any) {
    if (obj.preprocessor !== undefined) {
      this.preprocessor = obj.preprocessor; // TODO: Get preprocessor.
    }
  }
  
  protected getPreprocessor(): AnyFunction|null {
    if (typeof this.preprocessorFn !== "function") {
      this.preprocessorFn = PreprocessorManager.getPreprocessor(this.preprocessor);
    }
    return this.preprocessorFn;
  }

  /*protected preprocess() {

  }*/
}
