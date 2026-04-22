module.exports = {
  testEnvironment: "node",
  setupFiles: ["<rootDir>/tests/setup-env.ts"],
  clearMocks: true,
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "js", "json"],
  testPathIgnorePatterns: ["<rootDir>/dist/"],
};
