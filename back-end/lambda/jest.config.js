module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  // setupFiles: [
  //   "<rootDir>/jest.setup.js", // Path to your custom setup file
  // ],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  testMatch: ["**/?(*.)+(spec|test).ts"],
  moduleFileExtensions: ["ts", "js", "json", "node"],
};
