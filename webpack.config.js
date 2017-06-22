'use strict'

var babelOptions = {
    "presets" : [
        "env",
        "react"
    ]
}

module.exports = {
    
    entry: './src/index.ts',
    output: {
        filename: 'spsearch.js',
        path: __dirname + '/lib/',
        library: "spsearchjs",
        libraryTarget: "commonjs"
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: ['/node_modules/', 
                        __dirname + "/src/ts/spfx/"
                        ],
                use: [
                    {
                        loader: 'babel-loader',
                        options: babelOptions
                    },
                    {
                        loader: 'ts-loader'
                    }
                ]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: babelOptions
                    }
                ]
            }
        ]
    },
    resolve: {
        extensions: ['', '.ts','.tsx','.js','.json']
    },
    devtool: "source-map",
    externals : [
        "@microsoft/sp-http",
        "@microsoft/sp-webpart-base"
        ]
    
}