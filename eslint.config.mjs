// Full Next app profile with server logging, Drizzle boundaries and project layer limits.
import { defineConfig } from "eslint/config";
import drizzle from "eslint-plugin-drizzle";
import base from "./eslint-rules/next-base.mjs";

const dbModules = ["@/infrastructure/db", "@/infrastructure/db/*"];
const presentation = ["@/app", "@/app/*", "@/components", "@/components/*"];

export default defineConfig([
  ...base,
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: { drizzle },
    rules: {
      "quality/no-direct-console": [
        "error",
        { logger: "the server logger (remove client debug output)" },
      ],
      "quality/no-direct-data-access": [
        "error",
        {
          modules: ["@/infrastructure/db", "@/infrastructure/db/index"],
          bindings: ["db", "getDb"],
          layers: ["/src/app/", "/src/components/"],
          extensions: [".tsx"],
        },
      ],
      "drizzle/enforce-delete-with-where": [
        "error",
        { drizzleObjectName: ["db"] },
      ],
      "drizzle/enforce-update-with-where": [
        "error",
        { drizzleObjectName: ["db"] },
      ],
    },
  },
  {
    // Domain code and contracts stay independent of Next.js and presentation.
    files: ["src/domains/**/*.{ts,tsx}", "src/contracts/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["next", "next/*", ...presentation],
              message:
                "Domains and contracts must not depend on Next.js or presentation code.",
            },
          ],
        },
      ],
    },
  },
  {
    // Only repositories reach the database client; services receive data through them.
    files: ["src/domains/**/*.{ts,tsx}"],
    ignores: [
      "src/domains/**/*.repository.ts",
      "src/domains/**/repositories/**",
      "src/domains/**/*.test.ts",
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["next", "next/*", ...presentation],
              message:
                "Domains and contracts must not depend on Next.js or presentation code.",
            },
            {
              group: dbModules,
              message: "Access the database through a repository.",
            },
          ],
        },
      ],
    },
  },
]);
