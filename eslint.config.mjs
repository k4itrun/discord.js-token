// @ts-check
import eslintConfig from '@billoneta/config/eslint-config';
import { defineConfig } from 'eslint/config';

/** @type {import('eslint').Linter.Config[]} */
export default defineConfig([
 eslintConfig.base,
 eslintConfig.node,
 eslintConfig.prettier,
 [
  {
   name: 'Override',
   rules: {
    camelcase: 'off',
   },
  },
 ],
]);
