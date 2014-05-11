define(["gauge"], function() {

    var createGaugeMaster = function(vizSelector) {
        var gaugeMaster = {};
        gaugeMaster.clapGauge = {};
        gaugeMaster.vizSelector = vizSelector;

        gaugeMaster.createGauge = function (name, label, min, max)
        {
            console.log("CreateGauge called");
            var config =
            {
                size: 500,
                label: label,
                min: undefined != min ? min : 0,
                max: undefined != max ? max : 100,
                minorTicks: 5
            }

            var range = config.max - config.min;
            config.yellowZones = [{ from: config.min + range*0.75, to: config.min + range*0.9 }];
            config.redZones = [{ from: config.min + range*0.9, to: config.max }];

            var gauge = new Gauge(vizSelector, config);
            return gauge;
        };

        gaugeMaster.initialize = function()
        {
            console.log("Initialize called");
            console.log(this);
            gaugeMaster.clapGauge = gaugeMaster.createGauge("clapNumber", "Clap 'O Meter");
            gaugeMaster.clapGauge.render(); //It'll break if you don't render it before redrawing
        }

        gaugeMaster.update = function(value) {
//            console.log("Update called");
            if(value < gaugeMaster.clapGauge.config.min) value = gaugeMaster.clapGauge.config.min;
            else if(value > gaugeMaster.clapGauge.config.max) value = gaugeMaster.clapGauge.config.max;
            gaugeMaster.clapGauge.redraw(value);
        }
//        gaugeMaster.initialize();

        return gaugeMaster;
    };
    return {
        createGaugeMaster: createGaugeMaster
    };
});