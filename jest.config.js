module.exports = {
    coverageProvider: "v8",
    verbose: true,
    testEnvironment: "node",
    globalSetup: "<rootDir>/tests/configs/setup.js",
    globalTeardown: "<rootDir>/tests/configs/teardown.js",
};
