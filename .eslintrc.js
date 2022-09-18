module.exports = {
    root: true,
    env: {
        browser: true,
        es6: true,
        node: true,
    },
    globals: {
        Atomics: "readonly",
        SharedArrayBuffer: "readonly",
    },
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: "module",
        ecmaFeatures: {
            jsx: true,
        },
    },
    ignorePatterns: ["node_modules/*"],
    extends: ["eslint:recommended"],
    overrides: [
        {
            parser: "@typescript-eslint/parser",
            files: ["**/*.ts", "**/*.tsx"],
            plugins: ["prettier", "@typescript-eslint", "react", "react-hooks"],
            extends: [
                "eslint:recommended",
                "plugin:prettier/recommended",
                "plugin:react/recommended",
                "plugin:react-hooks/recommended",
                "plugin:@typescript-eslint/recommended",
            ],
            settings: {
                react: { version: "detect" }
            },
            rules: {
                "@typescript-eslint/no-unused-vars": ["warn"],
                "@typescript-eslint/explicit-function-return-type": ["off"],
                "@typescript-eslint/explicit-module-boundary-types": ["off"],
                "@typescript-eslint/no-empty-function": ["warn"],
                "@typescript-eslint/no-explicit-any": ["off"],
                "@typescript-eslint/no-var-requires": "warn",

                "react/react-in-jsx-scope": "off",
                "react/prop-types": "off",

                "react-hooks/rules-of-hooks": "error",
                "react-hooks/exhaustive-deps": "warn",

                "no-unused-vars": [
                    "off",
                    {
                        vars: "all",
                        args: "after-used",
                        ignoreRestSiblings: false,
                    },
                ],
                "prefer-const": "warn",
                "no-var": "warn",

                "prettier/prettier": ["warn", {}, { usePrettierrc: true }],
            },
        },
    ],
};
