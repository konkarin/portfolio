module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": [
        // JavaScript Standard Styleの適用
        "standard",
        // Vue公式スタイルガイド
        // 優先度Aのみ
        // "plugin:vue/essential"
        // 優先度A、B
        // "plugin:vue/strongly-recommended"
        // 優先度A～C
        "plugin:vue/recommended"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "vue"
    ],
    "rules": {
    }
};