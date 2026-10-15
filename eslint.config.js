import eslint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['build/**', 'node_modules/**'] },
  {
    files: ['**/*.ts', '**/*.tsx'],
    extends: [eslint.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    },
    plugins: {
      '@stylistic': stylistic
    },
    rules: {
      '@stylistic/max-len': ['error', { code: 120, tabWidth: 2 }]
    }
  }
);
