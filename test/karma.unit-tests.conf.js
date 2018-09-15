let path = require('path');
let argv = require('yargs').argv;


let LOW_PORT = 50001;
let HIGH_PORT = 60000;

module.exports = function (config) {
    config.set({

        basePath: './..',

        frameworks: ['jasmine-ajax', 'jasmine', 'karma-typescript'],

        files: [
            {pattern: './src/**/*.+(ts|html)'},
            './test/*.spec.ts'
        ],

        exclude: [],

        preprocessors: {
            './src/**/*.ts': ['karma-typescript'],
            './test/**/*.ts': ['karma-typescript']
        },

        karmaTypescriptConfig: {
            bundlerOptions: {
                sourceMap: true,
                entrypoints: /\.spec\.ts$/,
                transforms: [
                    require('karma-typescript-angular2-transform')
                ]
            },
            compilerOptions: {
                lib: ['ES2015', 'DOM'],
                sourceMap: true
            },
            reports:
                {
                    "cobertura": {
                        "directory": "../coverage",
                        "filename": "../coverage.xml",
                        "subdirectory": "cobertura"
                    },
                    "html": "../coverage",
                    "text-summary": ""
                },
            coverageOptions: {
                instrumentation: true,
                sourceMap: true,
                exclude: /\.(d|spec|test)\.ts/i
            }
        },

        reporters: ['spec', 'karma-typescript'],

        client: {
            captureConsole: true
        },

        port: 50000,

        colors: true,

        // level of logging: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_ERROR,

        autoWatch: false,

        customLaunchers: {
            MyHeadlessChrome: {
                base: 'ChromeHeadless',
                flags: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-translate',
                    '--disable-extensions',
                    '--remote-debugging-port=9222'
                ]
            }
        },

        browsers : ['MyHeadlessChrome'],

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

    if (argv['test-port'] === 'random') {
        config.port = Math.floor(Math.random() * (HIGH_PORT - LOW_PORT + 1) + LOW_PORT);
    } else if (argv['test-port']) {
        config.port = argv['test-port'];
    }
};
