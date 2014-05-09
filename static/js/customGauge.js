define(["gauge"], function() {

    var createGaugeMaster = function() {
        var gaugeMaster = {};
        gaugeMaster.clapGauge = {};

        gaugeMaster.initialize = function()
        {
            console.log("Initialize called");
            this.clapGauge = this.createGauge("clapNumber", "Clap 'O Meter");
            this.clapGauge.render(); //It'll break if you don't render it before redrawing
        }

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

            var gauge = new Gauge(name + "GaugeContainer", config);
            return gauge;
        };

        gaugeMaster.update = function(value) {
//            console.log("Update called");
            if(value < this.clapGauge.config.min) value = this.clapGauge.config.min;
            else if(value > this.clapGauge.config.max) value = this.clapGauge.config.max;
            this.clapGauge.redraw(value);
        }
//        gaugeMaster.initialize();

        return gaugeMaster;
    };
    return {
        createGaugeMaster: createGaugeMaster
    };
});