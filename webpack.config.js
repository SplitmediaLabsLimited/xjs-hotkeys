const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const noop = require('noop-webpack-plugin');

module.exports = (env = {}) => {
    const isProduction = env.production === true;
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
                    test: /\.s?css$/,
                    use: [
                        {   loader: 'style-loader' },
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 1
                            }
                        },
                        { loader: 'sass-loader' }
                    ]
                },
                {
                    test: /\.(png|jpg|woff)$/,
                    // when building production, convert everything to inlined data URLs
                    // but use actual filenames in development
                    use: isProduction ?
                        { loader: 'url-loader' } :
                        {
                            loader: 'file-loader',
                            options: {
                                name: '[name].[ext]'
                            }
                        }
                },
                {
                    test: /\.svg$/,
                    use: {
                        loader: 'svg-url-loader'
                    }
                }

            ]
        },
        plugins: [
            new webpack.optimize.ModuleConcatenationPlugin(),
            isProduction ? new UglifyJSPlugin({ sourceMap: true }) : noop(),
            isProduction ? new webpack.HashedModuleIdsPlugin() : noop(),
            isProduction ? new webpack.DefinePlugin({
                'process.env': {
                    'NODE_ENV': JSON.stringify('production')
                }
            }) : noop() // allows dependencies like React to build differently in prod
        ],
        resolve: {
            // This allows imports such as: import MyClass from 'myjsfile';
            extensions: ['.js', '.jsx', '.json'],
            modules: [
                path.resolve(__dirname, 'src'),
                'node_modules'
            ]
        },
        devtool: isProduction ? 'source-map' : 'eval-source-map',
        devServer: {
            contentBase: './src',
            hot: true
        }
    }
}