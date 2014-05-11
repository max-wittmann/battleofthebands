require(['./clientConfig'], function(config) {
    var visualizations = {"gauge": vizGauge};
//    var config = require('./clientConfig');

    console.log("Config is " + config);
    for(key in config) {
        console.log(key + ", " + config[key]);
    }

    function initViz(vizSelector) {
//        var vizName = config.vizMethod;
        var vizName = config["vizMethod"];

        if(!visualizations.hasOwnProperty(vizName)) {
            console.log("Don't have visualization " + vizName + ", defaulting to gauge");
            vizName = "gauge";
        }
        visualizations[vizName](vizSelector);
    }

    function vizGauge(vizSelector) {
        require(['customGauge'], function(customGaugeBuilder) {
            var gaugeMaster = customGaugeBuilder.createGaugeMaster(vizSelector);
            $(document).ready(buildViz(gaugeMaster.initialize, gaugeMaster.update));
        });
    }

    function buildViz(initFunc, updateFunc) {
        var socket = io.connect();

        initFunc(socket);

        socket.on('visualize_claps', function (data) {
            updateFunc(data.nrClaps);
        });
    }

    initViz("vizArea");
});

//require(['customGauge'], function(customGaugeBuilder) {
//$(document).ready(function () {
//    var socket = io.connect();
//
//    var gaugeMaster = customGaugeBuilder.createGaugeMaster();
//    gaugeMaster.initialize();
//
//    socket.on('visualize_claps', function (data) {
//        gaugeMaster.update(data.nrClaps);
//    });
//})
//});