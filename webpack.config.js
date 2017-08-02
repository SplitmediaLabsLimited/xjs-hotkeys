var webpack = require('webpack');

module.exports = {
  entry:  {
    lib: './src/js/lib/KeyStrokeHandler.js',
    ui: './src/js/component/XUIKeyStrokes.js'
  },  
  output: { 
    path: __dirname + '/dist',
    filename: 'js/[name].js' },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /(node_modules)/,
        query: {
          presets: ['es2015','stage-0','react']
        }
      },
      {
        test: /\.css$/,
        loader: 'css-loader'
      },
      {
        test: /\.(jpg|png)$/,
        loader: 'url-loader'
      }
    ]
  },
};