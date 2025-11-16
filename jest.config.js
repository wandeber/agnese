export default {
  moduleFileExtensions: [
    "ts",
    "js"
  ],
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", {
      tsconfig: "tsconfig.jest.json",
      diagnostics: {
        ignoreCodes: [151002]
      }
    }]
  },
  testMatch: [
    "**/test/**/*.test.(ts|js)"
  ],
  testEnvironment: "node",
  modulePaths: [
    "<rootDir>/src"
  ],
  moduleNameMapper: {
    "^@app/(.*)$": "<rootDir>/src/$1",
    "^@dependencies/(.*)$": "<rootDir>/other-dependencies/$1"
  },
  resolver: "<rootDir>/jest.resolver.cjs",
  collectCoverageFrom: [
    "src/**/*.ts"
  ]
};
