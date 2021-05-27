export type AnyFunction = (...args: any) => any;

export type PreprocessorFunction = (sourceData: any, value: any, ...args: any) => any;

export class Preprocessors {
  [key: string]: AnyFunction|PreprocessorFunction;
}



export default class PreprocessorManager {
  constructor(public preprocessors: Preprocessors) {
    this.preprocessors = preprocessors;
  }

  getPreprocessor(name: string): AnyFunction|null {
    let fn = null;
    if (this.preprocessors && typeof this.preprocessors[name] === "function") {
      fn = this.preprocessors[name];
    }
    return fn;
  }

  addPreprocessor(name: string, preprocessor: AnyFunction) {
    this.preprocessors[name] = preprocessor;
  }

  setPreprocessors(preprocessors: Preprocessors) {
    this.preprocessors = preprocessors;
  }
}
