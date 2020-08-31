module.exports = {
  parserOptions: {
    ecmaVersion: 2017,
  },
  extends: ['prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': ['error'],
  },
  env: {
    es6: true,
    node: true,
    jest: true,
  },
};
