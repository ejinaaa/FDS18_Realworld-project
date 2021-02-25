const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

module.exports = {
  entry: ['./client/src/index.ts'],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './server/dist/static/js')
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, './client/public/index.html'),
      favicon: './client/public/favicon.ico',
      inject: 'body',
      filename: path.join(__dirname, './server/dist/index.html')
    }),
    // new FaviconsWebpackPlugin('./client/public/favicon.ico')
  ],
  devServer: {
    historyApiFallback: true
  },
  devtool: 'source-map',
  mode: 'production'
};
