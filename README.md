# [Agnese](https://www.npmjs.com/package/agnese) - [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/wandeber/agnese/blob/main/LICENSE) [![version](https://img.shields.io/github/package-json/v/wandeber/agnese)](https://www.npmjs.com/package/agnese) [![size](https://img.shields.io/bundlephobia/min/agnese)](https://www.npmjs.com/package/agnese) [![ci](https://github.com/wandeber/agnese/actions/workflows/release-package.yml/badge.svg)](https://github.com/wandeber/agnese/actions) [![Coverage Status](https://coveralls.io/repos/github/wandeber/agnese/badge.svg?branch=main)](https://coveralls.io/github/wandeber/agnese?branch=main)

Save thouthands of lines in mappings.

> :warning: **Please, don't use this project on production until we release version 1.0.0. Agnese is taking shape and we could introduce incompatibilities or change our mind regarding certain features**.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Getting started](#getting-started)
- [Easy CSV generation](#easy-csv-generation)
- [License](#license)

## Features

- [x] Convert source data to objects, arrays, strings or simple data based on mapping configuration.
- [x] Read mapping configuration from JSON file.
- [x] Conditional fields/items powered by Quara*.
- [x] Array iteration.
- [x] Possibility of define a default value for a field.
- [x] Assign values by their paths in source data.
- [x] Force types and casting.
- [x] JSONC optional support.
- [ ] YAML optional support.
- [ ] Use of custom functions to preprocess values before assign them.
- [ ] Conditional value.

> *Quara is a simple JS interpreted language that will be available soon as a separate module.

## Installation

Agnese is available as an [NPM](https://www.npmjs.com/package/agnese) package:

```bash
npm install agnese
```

If you prefer download it from [Github Packages](https://github.com/wandeber/agnese/packages/807391) (take a look at the [documentation](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#installing-a-package)):

```bash
npm install @wandeber/agnese
```

## Getting started

We will use the next source data in the examples throughout this document:

```javascript
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
      power: "Uff...",
      level: 1
    },
    {
      name: "Super Saiyan II",
      power: "Ask Cell... (De locos...)",
      level: 2
    }
  ]
};
```

#### Simple mapping example:

One of the most awesome things about this module is you can keep all your mapping info in a separate JSON file.

##### map-info.json

```json
{
  "type": "Object",
  "fields": [
    {
      "name": "lastname",
      "if": {
        "quara": "surname == \"Son\""
      },
      "value": {
        "fromPath": "surname"
      }
    }
  ]
}
```

##### JSavaScript code to map from JSON file

```javascript
let mapper = new Agnese();
mapper.setMapInfo("map-info.json");
let target = mapper.map(sourceData);
```

The variable `target` will contain the next object:

```js
{
  lastname: "Son"
}
```

Since the code is almost completely common to any case of use, sometimes you will only find the map info or settings in future examples of this document.

> While I complete this documentation, I recommend you take a look at the examples used in the [unit tests](test/MapInfoFiles).

## Easy CSV generation

If you think on CSV as an object with one unique level, you can easily map any data to CSV or other similar structure. 

## License

[MIT © Bernardo Alemán Siverio](https://github.com/wandeber/agnese/blob/main/LICENSE)
