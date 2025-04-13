// @ts-check
/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = require('@k4i/eslint-config');

module.exports = [
  // prettier
  ...eslintConfig.base,
  ...eslintConfig.node,
  ...eslintConfig.prettier,
  {
    name: "Override",
    rules: {
      "require-await": "off",
      'node/no-process-exit': 'off',
    },
  },
];
