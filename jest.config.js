const tsJestPresets = require('ts-jest/presets');

module.exports = {
  moduleFileExtensions: [
    'js',
    'ts',
    'tsx'
  ],
  moduleDirectories: [
    'node_modules',
  ],
  testRegex: '/src/.*(test|spec)\\.(js|tsx?)$',
  testPathIgnorePatterns: [
    '/node_modules/',
    '/build/',
    '/coverage/',
  ],
  transform: {
    ...tsJestPresets.defaults.transform,
    '^.+\\.js$': 'babel-jest',
  },
  setupFiles: [
    '<rootDir>/src/testSetup.ts'
  ],
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      tsConfig: {
        esModuleInterop: true,
      },
      babelConfig: false,
    }
  },
  collectCoverage: false,
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**'
  ]
};
