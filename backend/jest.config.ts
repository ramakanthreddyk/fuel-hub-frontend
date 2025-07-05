import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.jest.json',
    },
  },
  testEnvironment: 'node',
  testTimeout: 10000,
  roots: ['<rootDir>/tests', '<rootDir>/__tests__'],
  globalSetup: '<rootDir>/jest.globalSetup.ts',
  globalTeardown: '<rootDir>/jest.globalTeardown.ts',
};

export default config;
