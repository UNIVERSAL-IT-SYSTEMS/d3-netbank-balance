require.config({
    paths: {
        jquery: '../bower_components/jquery/jquery',
        d3: '../bower_components/d3/d3',
        bootstrap: 'vendor/bootstrap'
    },
    shim: {
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        }
    }
});

require(['jquery', 'bootstrap', 'd3', 'app'], function ($, bootstrap, d3, app) {
    'use strict';
    app.bind();
});
