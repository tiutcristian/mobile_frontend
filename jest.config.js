const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  testEnvironment: "jsdom",
  collectCoverage: true,
  collectCoverageFrom: [
    "components/*.tsx",
    "app/**/*.tsx",
  ], 
  coverageReporters: ["text", "lcov"],
};

module.exports = createJestConfig(customJestConfig);