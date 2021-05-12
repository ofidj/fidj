module.exports = (config) => {
    config.set({

        basePath: './..',

        frameworks: ['jasmine-ajax', 'jasmine', 'karma-typescript'],

        files: [
            {pattern: 'src/**/*.+(ts|html)'},
            'test/*.spec.ts'
        ],

        exclude: [],

        preprocessors: {
            './**/*.ts': ['karma-typescript']
        },

        karmaTypescriptConfig: {
            compilerOptions: {
                target: 'es5',
                module: 'commonjs',
                lib: [
                    'es2015',
                    'dom'
                ],
                sourceMap: true,
                exclude: [],
            },
            coverageOptions: {
                instrumentation: false,
            },
        },

        reporters: ['spec', 'karma-typescript'],

        client: {
            captureConsole: true
        },

        colors: true,

        // level of logging: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_WARN,

        autoWatch: false,

        browsers: ['ChromeHeadless'],

        specReporter: {
            maxLogLines: 5,
            suppressErrorSummary: false,
            suppressFailed: false,
            suppressPassed: false,
            suppressSkipped: true,
            showSpecTiming: false
        },

        singleRun: true,

        concurrency: Infinity
    });
};
