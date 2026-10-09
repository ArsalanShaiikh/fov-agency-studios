import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  {
    // React Three Fiber mutates three.js objects (camera, uniforms, renderer)
    // inside useFrame by design; the compiler's immutability rule can't model that.
    files: ['src/three/**/*.{js,jsx}'],
    rules: { 'react-hooks/immutability': 'off' },
  },
  {
    files: ['scripts/**/*.{js,mjs}'],
    languageOptions: { globals: globals.node },
  },
])
