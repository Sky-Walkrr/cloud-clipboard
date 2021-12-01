module.exports = {
    outputDir: 'dist',
    publicPath: '',
    integrity: true,
    transpileDependencies: [
        'vuetify',
    ],
    pluginOptions: {
        webpackBundleAnalyzer: {
            analyzerMode: 'disabled',
            openAnalyzer: false,
        },
    },
    devServer: {
        port: 8889,
        proxy: {
            '/*': {
                target: 'http://localhost:8889/',
                changeOrigin: true,
            },
        },
    },
    productionSourceMap: false,
}