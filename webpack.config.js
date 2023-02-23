const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const rootAliases = require('./root-aliases');

module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  devtool: 'inline-source-map',
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'docs'),
  },
  devServer: {
    static: path.join(__dirname, 'docs')
  },
  module: {
    rules: [
      {
        test: /\.ts$/i,
        use: {
          loader: 'ts-loader',
        },
        exclude: /node_modules/,
      },

      {
        test: /\.js$/i,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
            ],
          },
        },
      },
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader"
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg|ttf|otf|woff|woff2)$/i,
        loader: 'file-loader',
        options: {
          outputPath: 'assets',
        },
      },
    ]
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      ...rootAliases.srcAliases,
      ...rootAliases.assetsAliases,
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      inject: true,
      template: path.resolve(__dirname, 'public', 'index.html'),
    }),
    new TerserPlugin({
      parallel: true,
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      linkType: 'text/css',
    }),
  ],
  devServer: {
    client: {
      overlay: {
        warnings: false,
        errors: false,
      },
    },
  },
};
