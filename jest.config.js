// eslint-disable-next-line @typescript-eslint/no-require-imports
const { createDefaultPreset } = require('ts-jest');

const defaultPresetTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: 'node',
  // collectCoverage: true,
  clearMocks: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  roots: ['<rootDir>/src'],
  setupFiles: ['<rootDir>/src/tests/mocks/mockEnv.ts'],
  collectCoverageFrom: [
    // 'src/**/*.ts',
    '!src/tests/mocks/*.ts',
    '!src/config/*.ts',
    '!src/clients/*',
    '!src/emails/components/*',
    '!src/controllers/type/*',
    '!src/functions/*',
  ],
  transform: {
    ...defaultPresetTransformCfg,
  },
};
