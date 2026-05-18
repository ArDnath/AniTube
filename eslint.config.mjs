import { nextJsConfig } from "@anitube/eslint-config/next-js";
import { config as reactInternalConfig } from "@anitube/eslint-config/react-internal";

/** @type {import("eslint").Linter.Config[]} */
export default [
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.next/**",
      "**/out/**",
      "**/build/**",
    ],
  },
  ...nextJsConfig.map((config) => {
    // If it's a global ignores object (contains only ignores), keep it as is
    if (config.ignores && Object.keys(config).length === 1) {
      return config;
    }
    return {
      ...config,
      files: ["apps/web/**/*.{js,jsx,ts,tsx}"],
    };
  }),
  ...reactInternalConfig.map((config) => {
    if (config.ignores && Object.keys(config).length === 1) {
      return config;
    }
    return {
      ...config,
      files: ["packages/ui/**/*.{js,jsx,ts,tsx}"],
    };
  }),
];
