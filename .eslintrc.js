// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  // parser: 'babel-eslint',
  parserOptions: {
    "parser": "babel-eslint",
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  extends: [
    'plugin:vue/essential',
    'standard'
  ],
  plugins: [
    'vue'
  ],
  // settings: {
  //   'import/resolver': {
  //     webpack: {
  //       config: './webpack.config.js',
  //     }
  //   }
  // },
  // add your custom rules here
  'rules': {
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    // allow console during development
    // 'no-console': process.env.NODE_ENV === 'production' ? 2 : 0,
    'import/extensions':0,
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'prefer-promise-reject-errors': 0
  },
  'globals': {
    document: true,
    location: true,
    window: true,
  },
}
