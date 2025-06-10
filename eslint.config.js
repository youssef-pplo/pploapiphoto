import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    rules: {
      'no-console': 'warn', // Warns if you leave console.log messages
      'no-unused-vars': 'off', // Turn off default rule to use the TS version
      '@typescript-eslint/no-unused-vars': 'warn', // Warns about unused variables
      '@typescript-eslint/no-explicit-any': 'warn' // Warns if you use the 'any' type
    }
  }
];