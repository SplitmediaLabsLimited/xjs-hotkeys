'use strict';

const eslintFormatter = require('react-dev-utils/eslintFormatter');

module.exports = {
  entry:  {
    lib: './src/js/lib/KeyStrokeHandler.js',
    ui: './src/js/component/XUIKeyStrokes.js'
  },  
  output: { 
    path: __dirname + '/dist',
    filename: 'js/[name].js' },
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },
  module: {    
    rules: [
       {
        test: /\.jsx?$/,
        enforce: 'pre',
        use: [
          {
            options: {
              formatter: eslintFormatter              
            },
            loader: 'eslint-loader',
          },
        ]
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,        
        use: [
          {
            loader: 'babel-loader',
            options: {
              babelrc: false,
              presets: [
                'es2015',
                'react',
              ],
            }
          }
        ]
      },
      {
        test: /\.css$/,
        loader: 'css-loader',
      },
      {
        test: /\.(jpg|png)$/,
        loader: 'url-loader'
      }
    ]
  }
};