const path = require('path');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { NetlifyPlugin } = require('netlify-webpack-plugin');

const baseConfig = {
    context: path.resolve(__dirname, 'src'),
    entry: {
        main: './router/router',
    },
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
            {
                test: /\.tsx?$/i,
                use: 'ts-loader',
                exclude: /node-modules/,
            },
            {
                test: /\.html$/,
                loader: 'html-loader',
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        clean: true,
        filename: '[name].[contenthash].js',
        assetModuleFilename: 'assets/[name][ext]',
        publicPath: '/',
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './index.html',
            chunks: ['main'],
        }),
        new CleanWebpackPlugin(),
        new NetlifyPlugin({
            redirects: [
                {
                    from: '/*',
                    to: '/index.html',
                    status: 200,
                },
            ],
        }),
    ],
};

module.exports = ({ mode }) => {
    const isProductionMode = mode === 'prod';
    const envConfig = isProductionMode ? require('./webpack.prod.config') : require('./webpack.dev.config');

    return merge(baseConfig, envConfig);
};
