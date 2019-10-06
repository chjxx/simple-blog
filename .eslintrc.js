module.exports = {
  root: true,
  rules: {
    "space-before-function-paren": ["error", {
      anonymous: "ignore",
      named: "ignore",
      asyncArrow: "ignore"
    }],
    semi: ["warn", "always"],
    "eol-last": ["error", "never"]
  },
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  extends: ["standard", 'plugin:vue/essential']
}