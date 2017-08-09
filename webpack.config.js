'use strict';

const eslintFormatter = require('react-dev-utils/eslintFormatter');
const webpack = require('webpack');

module.exports = {
  bail: true,
  devtool: 'source-map',
  entry:  {
    lib: './src/js/lib/KeyStrokeHandler.js',
    ui: './src/js/component/XUIKeyStrokes.js'
  },  
  output: {     
    path: __dirname + '/dist',
    filename: 'js/[name].min.js' },
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },
  module: {
    strictExportPresence: true,   
    rules: [
        {
          test: /\.css$/,
          loader: 'css-loader',
        },
        {
          test: /\.(jpg|png)$/,
          loader: 'url-loader'
        },
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
                ['es2015', { modules: false }],
                'react',
              ],
            }
          }
        ]
      }      
    ]
  },
  plugins:[
    // Minify the code.
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        // This feature has been reported as buggy a few times, such as:
        // https://github.com/mishoo/UglifyJS2/issues/1964
        // We'll wait with enabling it by default until it is more solid.
        reduce_vars: false,
      },
      output: {
        comments: false,
      },
      sourceMap: true,
    })
  ],
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
};