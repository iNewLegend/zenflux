const babel = require( "@babel/core" );

const babelOptions = {
    plugins: [
        // "@babel/plugin-transform-modules-commonjs",
        "@babel/plugin-transform-react-jsx-source",
        "@babel/plugin-syntax-jsx",
        "@babel/plugin-transform-react-jsx",
    ],
    presets: [
        // "@babel/preset-react"
    ],
    // "@babel/preset-typescript",
    // [
    //     "@babel/preset-env",
    //     {
    //         targets: {
    //             node: "current",
    //         },
    //     },
    // ],
    // ]
};

/**
 * @type {import("@jest/transform").SyncTransformer}
 */
const transformer = {
    process( content, filename ) {
        // return babel.transformSync( content, {
        //     ... babelOptions,
        //     filename,
        // } );

        const a = babel.transformSync( content, {
            ...babelOptions,
            filename,
        } );


        return a;
    }
};

module.exports = transformer;
