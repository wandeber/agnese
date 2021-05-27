import * as FS from "fs";
import MapInfo, {MapInfoBase} from "./MapInfo";
import PreprocessorManager, {Preprocessors} from "./PreprocessorManager";
import {FieldType} from "./Types";



// Optional dependency.
let MapInfoParser: JSON;
try {
  const YAML = require("yaml");
  if (YAML) {
    MapInfoParser = YAML;
  }
}
catch {}





export default class Agnese {
  /**
   * @deprecated Added in order to keep compatibility. Will be removed in version 1.0.0.
   */
  default = Agnese;
  
  Preprocessors = Preprocessors;

  PreprocessorManager = PreprocessorManager;

  MapInfo = MapInfo;
  
  FieldType = FieldType;

  preprocessorManager?: PreprocessorManager;

  /** @type {MapInfo} */
  mapInfo?: MapInfo;
  

  /**
   * If you pass the mapInfo paremeter, this constructor will call setMapInfo with it.
   * 
   * @param {MapInfo|MapInfoBase|string} [mapInfo]
   * @see {Agnese.setMapInfo}
   */
  constructor(mapInfo?: MapInfo|MapInfoBase|string) {
    if (mapInfo) {
      this.setMapInfo(mapInfo);
    }
  }

  /**
   * Sets the info needed for mapping process.
   * (You could use JSONC instead of JSON if you install the JSONC optional dependency).
   * 
   * @param {MapInfo|MapInfoBase|string} mapInfo
   *  Map info definition as a:
   *  - MapInfo object.
   *  - Plain object with format defined by MapInfoBase.
   *  - Path to a JSON file (string).
   *  - JSON string (string).
   * 
   * @return {boolean} true if the mapInfo is properly loaded and false if not.
   */
  setMapInfo(mapInfo: MapInfo|MapInfoBase|string): boolean {
    if (typeof mapInfo === "string") {
      try {
        mapInfo = FS.readFileSync(mapInfo).toString();
      }
      catch (error) {
        //console.log(`Error trying read mapInfo from file`);
      }
      
      try {
        mapInfo = MapInfoParser.parse(mapInfo);
      }
      catch (error) {
        //console.log("Error parsing file mapInfo file");
        return false;
      }
    }
    
    if (typeof mapInfo !== "object") {
      // MapInfo not recognized.
      return false;
    }

    if (mapInfo instanceof MapInfo) {
      this.mapInfo = mapInfo;
    }
    else {
      this.mapInfo = new MapInfo(mapInfo, this);
    }

    return true;
  }

  setPreprocessorManager(preprocessorManager: PreprocessorManager) {
    this.preprocessorManager = preprocessorManager;
  }

  /**
   * Map the data received in sourceData following the rules defined in mapInfo and returns the
   * result.
   * 
   * @param {any} sourceData Source data you want to turn into another thing based on the mapInfo.
   * @returns {any} The result of the transformation.
   */
  map(sourceData: any): any {
    let result: any;
    if (this.mapInfo) {
      result = this.mapInfo.map(sourceData);
    }
    return result;
  }
}
