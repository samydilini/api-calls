module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFiles: [
    "<rootDir>/jest.setup.js", // Path to your custom setup file
  ],
};
