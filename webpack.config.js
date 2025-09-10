const path = require('path');
const {XconThingsBoardWebpackPlugin} = require('@xcons/webpack-plugin-thingsboard');

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';

    return {
        mode: isProduction ? 'production' : 'development',
        entry: './src/widget.ts',
        devtool: isProduction ? false : 'source-map',

        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: {
                        loader: 'ts-loader',
                        options: {
                            configFile: path.resolve(__dirname, 'tsconfig.app.json')
                        }
                    },
                    exclude: /node_modules/,
                },
            ],
        },

        // External libraries configuration
        externals: {
            '@xcons/widget': {
                commonjs: '@xcons/widget',
                commonjs2: '@xcons/widget',
                amd: '@xcons/widget',
                root: 'XConWidgetCore'
            },
            '@xcons/core': {
                commonjs: '@xcons/core',
                commonjs2: '@xcons/core',
                amd: '@xcons/core',
                root: 'XConsCore'
            },
            '@xcons/common': {
                commonjs: '@xcons/common',
                commonjs2: '@xcons/common',
                amd: '@xcons/common',
                root: 'XConsCommon'
            }
        },

        output: {
            filename: 'widget.js',
            path: path.resolve(__dirname, 'dist'),
            library: {
                name: 'WidgetClass',
                type: 'var'
            },
            clean: true
        },

        optimization: {
            minimize: isProduction,
            minimizer: isProduction ? [
                new (require('terser-webpack-plugin'))({
                    terserOptions: {
                        mangle: {
                            reserved: ['__webpack_require__', '__webpack_modules__', '__webpack_module_cache__']
                        },
                        keep_classnames: true,
                        keep_fnames: true,
                        compress: {
                            sequences: false,
                            properties: false,
                            drop_console: false,
                            pure_funcs: []
                        }
                    }
                })
            ] : []
        },

        plugins: [
            new XconThingsBoardWebpackPlugin(
                {
                    debug: true,
                    defaultConfig: {
                        backgroundColor: '#ffffff',
                        textColor: '#000000',
                        showLegend: true,
                        showTitle: true
                    },
                    latestDataKeys: [
                        { name: 'temperature', label: 'Temperature', type: 'attribute' },
                        { name: 'humidity', label: 'Humidity', type: 'attribute' }
                    ],
                    dataKeys: [
                        {
                            name: 'latitude',
                            label: 'Latitude',
                            type: 'timeseries',
                            settings: {dataKeyType: 'latitude'}
                        },
                        {
                            name: 'longitude',
                            label: 'Longitude',
                            type: 'timeseries',
                            settings: {dataKeyType: 'longitude'}
                        },
                        {name: 'speed', label: 'Speed', type: 'timeseries', settings: {dataKeyType: 'speed'}},
                        {name: 'angle', label: 'Angle', type: 'timeseries', settings: {dataKeyType: 'angle'}}
                    ]
                }
            )
        ]
    };
};