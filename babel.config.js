module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset',
    "@babel/preset-env"
  ],
  "overrides": [
    {
      "test": "*.mjs",
      "sourceType": "module"
    }
  ]
}
