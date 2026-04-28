const globals = require("globals");

module.exports = [
  {
    ignores: ["node_modules/**", "coverage/**"],
  },
  {
    files: ["js/**/*.js", "tests/**/*.js", "sw.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-undef": "error",
      eqeqeq: ["error", "always"],
    },
  },
  {
    files: ["tests/**/*.js"],
    languageOptions: {
      globals: {
        describe: "readonly",
        it: "readonly",
        expect: "readonly",
      },
    },
  },
];
