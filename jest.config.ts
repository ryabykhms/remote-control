export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['./jest.setup.ts'],
  testTimeout: 60000,
  collectCoverage: true,
  collectCoverageFrom: ['src/**'],
  coverageThreshold: {
    global: {
      functions: 80,
      branches: 55,
      lines: 80,
    },
  },
};
