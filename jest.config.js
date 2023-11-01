/* eslint-env node */
/** @type {import("ts-jest").JestConfigWithTsJest} */
module.exports = {
  transform: {
    '^.+\\.(j|t)sx?$': '@swc/jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
