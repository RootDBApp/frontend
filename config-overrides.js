//module.exports = function override(config, env) {
module.exports = function override(config) {

    if (!config.plugins) {
        config.plugins = [];
    }

    // config.module.rules.push(
    //         {
    //             test: /\.s[ac]ss$/i,
    //             //exclude: /src\/scss\/main\.scss/,
    //             // loader: ['style-loader', 'css-loader?url=false', 'sass-loader'],
    //             use: [
    //                 // Creates `style` nodes from JS strings
    //                 "style-loader",
    //                 // Translates CSS into CommonJS
    //                 "css-loader",
    //                 // Compiles Sass to CSS
    //                 // "sass-loader"
    //                 {
    //                     loader: "sass-loader",
    //                     options: {
    //                         sassOptions: {
    //                             indentedSyntax: true,
    //                         },
    //                     },
    //                 },
    //             ],
    //         }
    // );

    config.ignoreWarnings = [
        {
            module: /pusher\.js/
        },
        {
            module: /worker-coffee\.js/
        },
        {
            message: /data:application\/json;base64\//
        }
    ];

    config.module.rules.push({
        test: /\.(js|mjs|jsx)$/,
        enforce: 'pre',
        loader: require.resolve('source-map-loader'),
        resolve: {
            fallback: {
                // "crypto": require.resolve("crypto-browserify"),
                // "stream": require.resolve("stream-browserify")
            },
            fullySpecified: false,
        },
    });

    return config;
};
