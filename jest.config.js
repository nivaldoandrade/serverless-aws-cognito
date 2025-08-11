// eslint-disable-next-line @typescript-eslint/no-require-imports
const { createDefaultPreset } = require('ts-jest');

const defaultPresetTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: 'node',
  collectCoverage: true,
  clearMocks: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  roots: ['<rootDir>/src'],
  coveragePathIgnorePatterns: ['<rootDir>/src/test/mocks/'],
  transform: {
    ...defaultPresetTransformCfg,
  },
};
