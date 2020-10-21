const LEVEL = process.env.NODE_ENV === "production" ? "error" : "warn";

module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "plugin:vue/essential",
    "plugin:prettier/recommended",
    "eslint:recommended",
  ],
  rules: {
    "no-console": LEVEL,
    "no-unused-vars": [LEVEL, { argsIgnorePattern: "^_" }],
    "no-constant-condition": "off",
    "vue/no-unused-components": LEVEL,
  },
  parserOptions: {
    parser: "@babel/eslint-parser",
  },
};
