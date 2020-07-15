//@ts-check

'use strict';

const path = require('path');

const config = {
  target: 'node',

  entry: './src/extension.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'extension.js',
    libraryTarget: 'commonjs2',
    devtoolModuleFilenameTemplate: '../[resource-path]'
  },
  devtool: 'source-map',
  externals: {
    vscode: 'commonjs vscode',
    coffeescript: 'coffeescript',
    'spdx-exceptions': 'spdx-exceptions',
    'spdx-license-ids': 'spdx-license-ids',
    'spdx-license-ids/deprecated': 'spdx-license-ids/deprecated'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  node: {
    fs: "empty",
    node_child: "empty",
    child_process: "empty",
    spdx_expression_parse: "empty",
    spdx_exceptions: "empty"
  },
  module: {
    rules: [
      // {
      //   test: /\.coffee$/,
      //   loader: 'coffee-loader',
      // },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'standard-loader'
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader'
          }
        ]
      }
    ]
  }
};
module.exports = config;
