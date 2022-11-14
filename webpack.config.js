const path = require('path');

const ts = {
  test: /\.ts?$/,
  exclude: /(node_modules)/,
  use: {
    loader: "swc-loader",
    options: {
      jsc: {
        parser: {
          syntax: "typescript"
        }
      }
    }
  }
};

module.exports = {
  mode: 'development',
  entry: {
    main: './src/index.ts',
  },
  output: {
    path: path.resolve(__dirname, 'public/static'),
    publicPath: '/static/',
    filename: '[name].bundle.js',
  },
  module: {
    rules: [ts],
  },
  optimization: {
    minimize: true,
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 3000,
  },
}