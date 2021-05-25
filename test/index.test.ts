import * as Path from "path";
import Agnese, { PreprocessorManager } from "../src/index";
import MapInfo from "../src/MapInfo";
import {Preprocessors} from "../src/PreprocessorManager";



const sourceData = {
  name: "Gohan",
  surname: "Son",
  isAlive: true,
  isDeath: false,
  alias: [
    "Great Saiyaman",
    "The Golden Fighter",
    "The Golden Warrior",
    "The Chosen One",
    "Monkey boy"
  ],
  characteristics: {
    race: "Human/Saiyan",
    gender: "Male",
    age: "10",
    height: 176.5,
    weight: 61
  },
  transformations: [
    {
      name: "Super Saiyan",
      power: "uff...",
      level: 1
    },
    {
      name: "Super Saiyan II",
      power: "Ask Cell... (De locos...)",
      level: 2
    }
  ]
};

const preprocessors: Preprocessors = {
  sum10: (source: any, value: any) => {
    return value + 10;
  }
};

const preprocessorManager = new PreprocessorManager(preprocessors);



describe("Map info creation", () => {
  let mapInfo: any;
  test("Read map info from JSONC file", () => {
    let mapper = new Agnese();
    mapper.setMapInfo(Path.join(__dirname, "./MapInfoFiles/create-object.jsonc"));
    mapInfo = mapper.mapInfo;
    expect(mapper.mapInfo instanceof MapInfo).toBeTruthy();
  });
  
  test("Pass MapInfo directly as a construct parameter", () => {
    let mapper = new Agnese();
    mapper.setMapInfo(mapInfo);
    expect(mapper.mapInfo instanceof MapInfo).toBeTruthy();
  });
});



describe("Base types", () => {
  test("Create boolean", () => {
    let mapper = new Agnese();
    mapper.setMapInfo(Path.join(__dirname, "./MapInfoFiles/create-boolean.jsonc"));
    expect(mapper.map(sourceData)).toEqual(true);
  });

  test("Create integer", () => {
    let mapper = new Agnese();
    mapper.setMapInfo(Path.join(__dirname, "./MapInfoFiles/create-integer.jsonc"));
    expect(mapper.map(sourceData)).toEqual(176);
  });

  test("Create float", () => {
    let mapper = new Agnese();
    mapper.setMapInfo(Path.join(__dirname, "./MapInfoFiles/create-float.jsonc"));
    expect(mapper.map(sourceData)).toEqual(10.0);
  });
  
  test("Create number", () => {
    let mapper = new Agnese();
    mapper.setMapInfo(Path.join(__dirname, "./MapInfoFiles/create-number.jsonc"));
    expect(mapper.map(sourceData)).toEqual(10);
  });

  test("Create string", () => {
    let mapper = new Agnese();
    mapper.setMapInfo(Path.join(__dirname, "./MapInfoFiles/default-string-value.jsonc"));
    expect(mapper.map(sourceData)).toEqual("Son Goku");
  });

  test("Concatenate strings", () => {
    let mapper = new Agnese();
    mapper.setMapInfo(Path.join(__dirname, "./MapInfoFiles/concatenate-strings.jsonc"));
    expect(mapper.map(sourceData)).toEqual("Son Gohan is the best warrior.");
  });

  test("Create object", () => {
    let mapper = new Agnese();
    mapper.setMapInfo(Path.join(__dirname, "./MapInfoFiles/create-object.jsonc"));
    expect(mapper.map(sourceData)).toEqual({
      parent: "Son Goku"
    });
  });

  test("Create array", () => {
    let mapper = new Agnese();
    mapper.setMapInfo(Path.join(__dirname, "./MapInfoFiles/create-array.jsonc"));
    expect(mapper.map(sourceData)).toEqual(["Great Saiyaman", "The Chosen One"]);
  });
});



describe("Base item/field features", () => {
  describe("Field if", () => {
    test("if exists", () => {
      let mapper = new Agnese();
      mapper.setMapInfo(Path.join(__dirname, "./MapInfoFiles/conditional-exists-fields.jsonc"));
      expect(mapper.map(sourceData)).toEqual({
        surname: "Son"
      });
    });

    test("if quara condition", () => {
      let mapper = new Agnese();
      mapper.setMapInfo(Path.join(__dirname, "./MapInfoFiles/conditional-quara-fields.jsonc"));
      expect(mapper.map(sourceData)).toEqual({
        surname: "Son"
      });
    });

    test("if value", () => {
      let mapper = new Agnese();
      mapper.setMapInfo(Path.join(__dirname, "./MapInfoFiles/conditional-if-value.jsonc"));
      expect(mapper.map(sourceData)).toEqual({
        message: "He's alive!"
      });
    });

    test("if empty (considered false)", () => {
      let mapper = new Agnese();
      mapper.setMapInfo(Path.join(__dirname, "./MapInfoFiles/field-if-empty.jsonc"));
      expect(mapper.map(sourceData)).toEqual({});
    });
  });

  describe("Preprocessors", () => {
    test("Preprocessor by name", () => {
      let mapper = new Agnese();
      mapper.setMapInfo(Path.join(__dirname, "./MapInfoFiles/preprocessor-sum.jsonc"));
      mapper.setPreprocessorManager(preprocessorManager);
      expect(mapper.map(sourceData)).toEqual(186);
    });
  });

  describe("Field iterate", () => {
    test("Iterate", () => {
      let mapper = new Agnese();
      mapper.setMapInfo(Path.join(__dirname, "./MapInfoFiles/field-iterate.jsonc"));
      expect(mapper.map(sourceData)).toEqual([
        {
          number: 0,
          transformationName: "Super Saiyan"
        },
        {
          number: 1,
          transformationName: "Super Saiyan II"
        }
      ]);
    });
  });

  test("Allow empty compound fields", () => {
    let mapper = new Agnese();
    mapper.setMapInfo(Path.join(__dirname, "./MapInfoFiles/empty-allowed.jsonc"));
    expect(mapper.map(sourceData)).toEqual([]);
  });

  test("Don't allow empty compound fields", () => {
    let mapper = new Agnese();
    mapper.setMapInfo(Path.join(__dirname, "./MapInfoFiles/empty-not-allowed.jsonc"));
    expect(mapper.map(sourceData)).toBeUndefined();
  });
});



describe("Value", () => {
  test("Value from path", () => {
    let mapper = new Agnese();
    mapper.setMapInfo(Path.join(__dirname, "./MapInfoFiles/from-path.jsonc"));
    expect(mapper.map(sourceData)).toEqual({
      lastname: "Son"
    });
  });

  test("Value from first present path", () => {
    let mapper = new Agnese();
    mapper.setMapInfo(Path.join(__dirname, "./MapInfoFiles/from-first-present-path.jsonc"));
    expect(mapper.map(sourceData)).toEqual({
      name: "Gohan"
    });
  });
});
