/* eslint-disable require-unicode-regexp */
/* eslint-disable @typescript-eslint/no-var-requires */
const dotenv = require('dotenv');
const dotenvWebpack = require('dotenv-webpack');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin');
const path = require('path');

dotenv.config();

module.exports = {
  mode: process.env.NODE_ENV,
  entry: path.join(__dirname, 'src/client/index.tsx'),
  output: {
    path: path.join(__dirname, 'build/client'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/client/index.html'),
    }),
    new dotenvWebpack(),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css',
    }),
    new PurgecssPlugin({
      paths: glob.sync(path.join(__dirname, 'src/client/**/*'), {
        nodir: true,
      }),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/i,
        loader: 'ts-loader',
        include: path.join(__dirname, 'src'),
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
        include: [path.join(__dirname, 'src')],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
  },
  devServer: {
    port: process.env.DEV_CLIENT_PORT,
    historyApiFallback: true,
    host: '0.0.0.0',
    public: 'localhost:' + process.env.DEV_CLIENT_PORT,
  },
  devtool: process.env.NODE_ENV === 'development' ? 'source-map' : false,
};
