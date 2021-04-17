module.exports = function (rootPath) {
  require('@babel/register')({
    presets: ['@umijs/babel-preset-umi/node'],
    ignore: [/node_modules/],
    only: [
      function (filePath) {
        if (!rootPath) {
          return true
        }
        return filePath.startsWith(rootPath)
      }
    ],
    extensions: ['.jsx', '.js', '.ts', '.tsx'],
    babelrc: false,
    cache: false,
  });
}
