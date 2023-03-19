const path = require('path');
const CleanPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
require('dotenv').config({ path: './.env' }); 

module.exports = {
    mode: 'development',
    entry: {
    'Index': './src/index.js',
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist', 'assets', 'scripts'),
      publicPath: 'assets/scripts/'
    },
    devtool: 'eval-cheap-module-source-map',
    devServer: {
     static: './dist'
    },
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /(node_modules)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  { useBuiltIns: 'usage', corejs: { version: 3 } }
                ]
              ]
            }
          }
        }
      ]
    },
    plugins: [
      new CleanPlugin.CleanWebpackPlugin(),
      new webpack.DefinePlugin({
        'process.env': JSON.stringify(process.env)
      })
    ]
  };