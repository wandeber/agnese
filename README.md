# [Agnese](https://www.npmjs.com/package/agnese) - [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/wandeber/agnese/blob/main/LICENSE) [![version](https://img.shields.io/github/package-json/v/wandeber/agnese)](https://www.npmjs.com/package/agnese) [![size](https://img.shields.io/bundlephobia/min/agnese)](https://www.npmjs.com/package/agnese) [![ci](https://github.com/wandeber/agnese/actions/workflows/release-package.yml/badge.svg)](https://github.com/wandeber/agnese/actions) [![Coverage Status](https://coveralls.io/repos/github/wandeber/agnese/badge.svg)](https://coveralls.io/github/wandeber/agnese)

Agnese is an object mapper that allows you to transform an object (or array) into another one with different structure.

The target is to completely remove or a least separate and organize the mapping code from our projects making it easy to maintain. In order to achieve this mission, Agnese makes possible to define the new structure in a JSON/YAML file and using directly there simple conditions and arithmetic operations with Quara, a tiny JavaScript interpreted language.

For more complex needs, you can create your own preprocessors and point to them with different arguments to treat any data you want.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Getting started](#getting-started)
  - [Simple mapping example](#simple-mapping-example)
  - [Autocompletion](#autocompletion)
    - [JSON](#json)
    - [YAML](#yaml)
- [Easy CSV generation](#easy-csv-generation)
- [License](#license)

## Features

- Convert source data to objects, arrays, strings or simple data based on mapping configuration.
- Read mapping configuration from JSON file.
- Conditional fields/items powered by Quara*.
- Array iteration.
- Possibility of define a default value for a field.
- Assign values by their paths in source data.
- Force types and casting.
- Use of custom functions to preprocess values before assign them.
- Values from conditional path (switch).
- YAML optional support.

> *Quara is a simple JavaScript interpreted language that will be available soon as a separate module.

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

##### JavaScript code to map from JSON file

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

### Autocompletion

Agnese provides [JSON schemas](schemas) that you can use with VSCode to enable autocompletion and validation.

#### JSON

```json
{
  "$schema": "node_modules/agnese/schema/index.json",
  "value": {
    "type": "Integer",
    "fromPath": "characteristics.age"
  }
}
```

#### YAML

You need to install the [YAML](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml) extension.

```yaml
# yaml-language-server: $schema=node_modules/agnese/schema/index.json
type: Object
fields:
  - name: parent
    value:
      default: Son Goku
```

## Easy CSV generation

If you think on CSV as an object with one unique level, you can easily map any data to CSV or other similar structure. 

## License

Agnese © 2024 by [Bernardo Alemán Siverio (wandeber)](https://github.com/wandeber) is licensed under [CC BY-ND 4.0](./LICENSE)
