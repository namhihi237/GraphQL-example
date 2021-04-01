module.exports = {
    coverageProvider: "v8",
    verbose: true,
    testEnvironment: "node",
    globalSetup: "<rootDir>/tests/configs/setup.js",
    globalTeardown: "<rootDir>/tests/configs/teardown.js",
    coverageThreshold: {
        global: {
            branches: 50,
            functions: 50,
            lines: 50,
            statements: 50,
        },
    },
};
