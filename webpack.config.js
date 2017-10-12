const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = (env = {}) => {    
    return {
        context: path.join(__dirname),
        // initially, let's just have one
        entry: __dirname + '/src/bundle.js',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'xjs-hotkeys.bundle.js',
            library: 'xjs-hotkeys',
            libraryTarget: 'umd',
            umdNamedDefine: true
        },
        externals: {
            react: {
                commonjs: 'react',
                commonjs2: 'react',
                amd: 'react',
                umd: 'react'
            }
        },
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            babelrc: false, // avoid any confusion
                            presets: [
                                ['env', { modules: false }],
                                'react'
                            ],
                            env: {
                                production: {
                                    // additionally remove unused ES2015 classes
                                    presets: ['minify']
                                }
                            },
                            plugins: ['transform-class-properties']
                        }
                    }
                },
                {
                    test: /\.css$/,
                    use: [                        
                        {   loader: 'css-loader', 
                            options: {
                              importLoaders: 1
                            }
                        }                      
                    ]
                },
                {
                    test: /\.(png|jpg|svg|woff)$/,
                    // when building production, convert everything to inlined data URLs                    
                    use:{ loader: 'url-loader' }                         
                }
            ]
        },
        plugins: [
            new webpack.optimize.ModuleConcatenationPlugin(),
            new UglifyJSPlugin({ sourceMap: false }),
            new webpack.HashedModuleIdsPlugin(),
            new webpack.DefinePlugin({
                'process.env': {
                    'NODE_ENV': JSON.stringify('production')
                }
            })
        ],
        resolve: {
            // This allows imports such as: import MyClass from 'myjsfile';
            extensions: ['.js', '.jsx', '.json'],
            modules: [
                path.resolve(__dirname, 'src'),
                'node_modules'
            ]
        },        
        devServer: {
            contentBase: './src',
            hot: true
        }
    }
}