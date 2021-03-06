module.exports = {
    env: {
        es2021: true,
        node: true
    },
    extends: [
        'plugin:@typescript-eslint/recommended',
        'eslint-config-semistandard'
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module'
    },
    plugins: [
        '@typescript-eslint'
    ],
    rules: {
        indent: [
            'error',
            4
        ]
    },
    ignorePatterns: [
        'app/**/*'
    ]
};
