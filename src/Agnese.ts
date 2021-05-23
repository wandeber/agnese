import * as FS from "fs";
import MapInfo, {MapInfoBase} from "./MapInfo";

// Optional dependency.
// TODO: Look for a maintained alternative.
let JSONParser: any = JSON;
try {
  const JSONC = require("jsonc");
  if (JSONC) {
    JSONParser = JSONC;
  }
}
catch {}





export default class Agnese {
  preprocessors: any;

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
  public setMapInfo(mapInfo: MapInfo|MapInfoBase|string): boolean {
    if (typeof mapInfo === "string") {
      try {
        mapInfo = FS.readFileSync(mapInfo).toString();
      }
      catch (error) {
        //console.log(`Error trying read mapInfo from file`);
      }

      try {
        mapInfo = JSONParser.parse(mapInfo);
      }
      catch (error) {
        console.log(`Error parsing file ${mapInfo} as JSONParser`, error);
        return false;
      }
    }
    
    if (typeof mapInfo === "object") {
      if (mapInfo instanceof MapInfo) {
        this.mapInfo = mapInfo;
      }
      else {
        this.mapInfo = new MapInfo(mapInfo);
      }
    }

    return true;
  }

  /**
   * Map the data received in sourceData following the rules defined in mapInfo and returns the
   * result.
   * 
   * @param {any} sourceData Source data you want to turn into another thing based on the mapInfo.
   * @returns {any} The result of the transformation.
   */
  public map(sourceData: any): any {
    let result: any;
    if (this.mapInfo) {
      result = this.mapInfo.map(sourceData);
    }
    return result;
  }
}
