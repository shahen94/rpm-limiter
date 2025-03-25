module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["text", "html", "lcov"],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!**/node_modules/**",
    "!**/dist/**"
  ],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/dist/"
  ]
};