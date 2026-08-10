import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Taşınan HTML prototipinin ham kaynağı — referans amaçlı tutuluyor,
    // derlenmiyor ve linlenmiyor.
    "_kaynak/**",
  ]),
  {
    // Teşhis/test scriptleri: kısa `koşul ? ok() : bad()` biçimi bilinçli.
    files: ["scripts/**/*.mjs"],
    rules: { "@typescript-eslint/no-unused-expressions": "off" },
  },
]);

export default eslintConfig;
