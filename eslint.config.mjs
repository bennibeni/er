import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';

export default defineConfig([
  ...nextVitals,
  globalIgnores(['.next/**', '.next-check/**', 'node_modules/**', 'playwright-report/**', 'test-results/**']),
]);
