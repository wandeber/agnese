import * as Path from "path";
import Agnese from "../src/index";
import MapInfo from "../src/MapInfo";
import PreprocessorManager, {Preprocessors} from "../src/PreprocessorManager";
import {FieldType} from "../src/Types";





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
    weight: 61,
    weakness: null
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
preprocessorManager.addPreprocessor("formatDate", () => {});
preprocessorManager.setPreprocessors(preprocessors);



describe("Index module imports", () => {
  test("Agnese available", () => {
    expect(Agnese).toBeDefined();
  });
  test("FieldType available", () => {
    expect(FieldType).toBeDefined();
  });
  test("MapInfo available", () => {
    expect(MapInfo).toBeDefined();
  });
  test("PreprocessorManager available", () => {
    expect(PreprocessorManager).toBeDefined();
  });
  test("Preprocessors available", () => {
    expect(Preprocessors).toBeDefined();
  });
});

describe("Map info creation", () => {
  let mapInfo: any;
  test("Read map info from JSONC file", () => {
    let mapper = new Agnese();
    mapper.setMapInfo(Path.join(__dirname, "./MapInfoFiles/create-object.yaml"));
    mapInfo = mapper.mapInfo;
    expect(mapper.mapInfo instanceof MapInfo).toBeTruthy();
  });
  
  test("Pass MapInfo directly as a construct parameter", () => {
    let mapper = new Agnese(mapInfo);
    expect(mapper.mapInfo instanceof MapInfo).toBeTruthy();
  });

  test("Pass MapInfo file with wrong format", () => {
    let mapper = new Agnese();
    mapper.setMapInfo(Path.join(__dirname, "./MapInfoFiles/wrong-format.yaml"));
    expect(mapper.mapInfo instanceof MapInfo).toBeFalsy();
  });

  test("Pass non-existent file", () => {
    let mapper = new Agnese(mapInfo);
    mapper.setMapInfo(Path.join(__dirname, "./MapInfoFiles/not-real.json"));
    expect(mapper.mapInfo instanceof MapInfo).toBeTruthy();
  });
});

describe("Map", () => {
  test("Map without map info", () => {
    let mapper = new Agnese();
    expect(mapper.map(sourceData)).toEqual(undefined);
  });
});

describe("Base types", () => {
  test("Create boolean", () => {
    let mapper = new Agnese();
    mapper.setMapInfo(Path.join(__dirname, "./MapInfoFiles/create-boolean.json"));
    expect(mapper.map(sourceData)).toEqual(true);
  });

  test("Create integer", () => {
    let mapper = new Agnese();
    mapper.setMapInfo(Path.join(__dirname, "./MapInfoFiles/create-integer.yaml"));
    expect(mapper.map(sourceData)).toEqual(176);
  });

  test("Create float", () => {
    let mapper = new Agnese();
    mapper.setMapInfo(Path.join(__dirname, "./MapInfoFiles/create-float.json"));
    expect(mapper.map(sourceData)).toEqual(10.0);
  });
  
  test("Create number", () => {
    let mapper = new Agnese();
    mapper.setMapInfo(Path.join(__dirname, "./MapInfoFiles/create-number.json"));
    expect(mapper.map(sourceData)).toEqual(10);
  });

  test("Create string", () => {
    let mapper = new Agnese();
    mapper.setMapInfo(Path.join(__dirname, "./MapInfoFiles/default-string-value.json"));
    expect(mapper.map(sourceData)).toEqual("Son Goku");
  });

  test("Concatenate strings", () => {
    let mapper = new Agnese();
    mapper.setMapInfo(Path.join(__dirname, "./MapInfoFiles/concatenate-strings.json"));
    expect(mapper.map(sourceData)).toEqual("Son Gohan is the best warrior.");
  });

  test("Create object", () => {
    let mapper = new Agnese();
    mapper.setMapInfo(Path.join(__dirname, "./MapInfoFiles/create-object.yaml"));
    expect(mapper.map(sourceData)).toEqual({
      parent: "Son Goku"
    });
  });

  test("Create array", () => {
    let mapper = new Agnese();
    mapper.setMapInfo(Path.join(__dirname, "./MapInfoFiles/create-array.json"));
    expect(mapper.map(sourceData)).toEqual(["Great Saiyaman", "The Chosen One"]);
  });
});

describe("Base item/field features", () => {
  describe("Field if", () => {
    test("if exists", () => {
      let mapper = new Agnese();
      mapper.setMapInfo(Path.join(__dirname, "./MapInfoFiles/conditional-exists-fields.json"));
      expect(mapper.map(sourceData)).toEqual({
        surname: "Son"
      });
    });

    test("if quara condition", () => {
      let mapper = new Agnese();
      mapper.setMapInfo(Path.join(__dirname, "./MapInfoFiles/conditional-quara-fields.json"));
      expect(mapper.map(sourceData)).toEqual({
        surname: "Son"
      });
    });

    test("if value", () => {
      let mapper = new Agnese();
      mapper.setMapInfo(Path.join(__dirname, "./MapInfoFiles/conditional-if-value.json"));
      expect(mapper.map(sourceData)).toEqual({
        message: "He's alive!"
      });
    });

    test("if empty (considered false)", () => {
      let mapper = new Agnese();
      mapper.setMapInfo(Path.join(__dirname, "./MapInfoFiles/field-if-empty.json"));
      expect(mapper.map(sourceData)).toEqual({});
    });
  });

  describe("Preprocessors", () => {
    test("Preprocessor by name", () => {
      let mapper = new Agnese();
      mapper.setMapInfo(Path.join(__dirname, "./MapInfoFiles/preprocessor-sum.json"));
      mapper.setPreprocessorManager(preprocessorManager);
      expect(mapper.map(sourceData)).toEqual(186);
    });
  });

  describe("Field iterate", () => {
    test("Iterate", () => {
      let mapper = new Agnese();
      mapper.setMapInfo(Path.join(__dirname, "./MapInfoFiles/field-iterate.json"));
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
    mapper.setMapInfo(Path.join(__dirname, "./MapInfoFiles/empty-allowed.json"));
    expect(mapper.map(sourceData)).toEqual([]);
  });

  test("Don't allow empty compound fields", () => {
    let mapper = new Agnese();
    mapper.setMapInfo(Path.join(__dirname, "./MapInfoFiles/empty-not-allowed.json"));
    expect(mapper.map(sourceData)).toBeUndefined();
  });
});



describe("Value", () => {
  test("Cast to integer", () => {
    let mapper = new Agnese(Path.join(__dirname, "./MapInfoFiles/cast-to-integer.json"));
    expect(mapper.map(sourceData)).toEqual(10);
  });

  test("Null value", () => {
    let mapper = new Agnese(Path.join(__dirname, "./MapInfoFiles/value-null.json"));
    expect(mapper.map(sourceData)).toEqual(null);
  });

  test("Value inside null", () => {
    let mapper = new Agnese(Path.join(__dirname, "./MapInfoFiles/value-inside-null.json"));
    expect(mapper.map(sourceData)).toBeUndefined();
  });

  test("Value inside undefined", () => {
    let mapper = new Agnese(Path.join(__dirname, "./MapInfoFiles/value-inside-undefined.json"));
    expect(mapper.map(sourceData)).toBeUndefined();
  });

  test("Value from path", () => {
    let mapper = new Agnese(Path.join(__dirname, "./MapInfoFiles/from-path.json"));
    expect(mapper.map(sourceData)).toEqual({
      lastname: "Son"
    });
  });

  test("Value from conditional path", () => {
    let mapper = new Agnese(Path.join(__dirname, "./MapInfoFiles/from-conditional-path.json"));
    expect(mapper.map(sourceData)).toEqual({
      name: "Gohan"
    });
  });

  test("Value from conditional path 2", () => {
    let mapper = new Agnese(Path.join(__dirname, "./MapInfoFiles/from-conditional-path-falsy.json"));
    expect(mapper.map(sourceData)).toEqual({});
  });

  test("Value from first present path", () => {
    let mapper = new Agnese(Path.join(__dirname, "./MapInfoFiles/from-first-present-path.json"));
    expect(mapper.map(sourceData)).toEqual({
      name: "Gohan"
    });
  });
});

describe("Iterator", () => {
  test("Iterate undefined", () => {
    let mapper = new Agnese(Path.join(__dirname, "./MapInfoFiles/iterate-undefined.json"));
    expect(mapper.map(sourceData)).toBeUndefined();
  });

  test("Iterate to generate object", () => {
    let mapper = new Agnese(Path.join(__dirname, "./MapInfoFiles/iterate-to-generate-object.json"));
    expect(mapper.map(sourceData)).toEqual({
      transformation1: {number: 0, transformationName: 'Super Saiyan'},
      transformation2: {number: 1, transformationName: 'Super Saiyan II'}
    });
  });

  test("Iterate to generate string", () => {
    let mapper = new Agnese(Path.join(__dirname, "./MapInfoFiles/iterate-to-generate-string.json"));
    expect(mapper.map(sourceData)).toEqual("12");
  });

  test("Iterate to sum", () => {
    let mapper = new Agnese(Path.join(__dirname, "./MapInfoFiles/iterate-to-sum.json"));
    expect(mapper.map(sourceData)).toEqual(3);
  });
});

describe("Preprocessor", () => {
  test("Null preprocessor", () => {
    expect(preprocessorManager.getPreprocessor("undefinedPreprocessor")).toBeNull();
  });
});
