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
    // 디자인 원본. 앱이 임포트하지 않는다 — neo-dots.js는 DotGeo로 포팅하기 전의
    // 바닐라 원본이고 support.js는 캔버스 내보내기다. 손대지 않고 보존하는 자료라
    // 앱 규칙으로 재단하지 않는다.
    "design/**",
  ]),
]);

export default eslintConfig;
