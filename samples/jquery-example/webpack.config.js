'use strict'

var babelOptions = {
    "presets" : [
        "env",
        "react"
    ]
}

module.exports = {
    context: __dirname + '/src/',
    entry: {
        bundle: './app.ts'
    },
    output: {
        filename: '[name].js',
        path: __dirname + '/lib/'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: ['/node_modules/'
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
        extensions: ['.ts','.tsx','.js','.json']
    },
    devtool: "source-map"
    
}