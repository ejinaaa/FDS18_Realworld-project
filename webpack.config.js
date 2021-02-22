const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

module.exports = {
  entry: ['./src/index.ts'],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, './public/index.html'),
      favicon: './public/favicon.ico',
      inject: 'body',
      filename: path.join(__dirname, './dist/index.html')
    }),
    new FaviconsWebpackPlugin('./public/favicon.ico')
  ],
  devServer: {
    historyApiFallback: true
  },
  devtool: 'source-map',
  mode: 'development'
};
