module.exports = {
  env: { browser: true, es2021: true, node: true },
  extends: ["eslint:recommended", "plugin:react/recommended"],
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  settings: { react: { version: "detect" } },
  plugins: ["react", "unused-imports"],
  rules: {
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": ["error", { vars: "all", args: "after-used", ignoreRestSiblings: true }],
    "react/prop-types": "off"
  }
};
