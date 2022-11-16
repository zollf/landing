const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

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

const css = {
  test: /\.(sa|sc|c)ss$/i,
  use: [
    MiniCssExtractPlugin.loader,
    "css-loader",
    "postcss-loader",
    "sass-loader"
  ]
}

const WebpackConfig = {
  mode: 'development',
  entry: {
    main: './index.ts',
  },
  output: {
    path: path.resolve(__dirname, 'public/static'),
    publicPath: '/static/',
    filename: '[name].bundle.js',
  },
  module: {
    rules: [ts, css],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin()
    ]
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 3000,
  },
  plugins: [new MiniCssExtractPlugin()],
}

module.exports = WebpackConfig