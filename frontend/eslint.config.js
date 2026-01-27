const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo');

module.exports = defineConfig([
  expoConfig,
  {
    plugins: {
      prettier: require('eslint-plugin-prettier'),
    },
    rules: {
      'prettier/prettier': 'error',
    },
    ignores: ['dist/*'],
  },
]);
