define(["gauge"], function() {
//    var createGaugeMaster = function() {
//
//            this.clapGauge = {};
//
//            function createGauge(name, label, min, max)
//            {
//                var config =
//                {
//                    size: 500,
//                    label: label,
//                    min: undefined != min ? min : 0,
//                    max: undefined != max ? max : 100,
//                    minorTicks: 5
//                }
//
//                var range = config.max - config.min;
//                config.yellowZones = [{ from: config.min + range*0.75, to: config.min + range*0.9 }];
//                config.redZones = [{ from: config.min + range*0.9, to: config.max }];
//
//                var gauge = new Gauge(name + "GaugeContainer", config);
//                return gauge;
//            }
//
//            function initialize()
//            {
//                createGauges();
//            }
//
//            function createGauges()
//            {
//                this.clapGauge = createGauge("clapNumber", "Clap 'O Meter");
//                this.clapGauge.render(); //It'll break if you don't render it before redrawing
//            }
//
//            function update(value) {
//                if(value < gauge.config.min) value = gauge.config.min;
//                else if(value > gauge.config.max) value = gauge.config.max;
//                gauge.redraw(value);
//            }
//        };

    var createGaugeMaster = function() {
//        var temp = {

        var gaugeMaster = {};
        gaugeMaster.clapGauge = {};
        gaugeMaster.createGauge = function (name, label, min, max)
        {
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

        gaugeMaster.initialize = function()
        {
            this.createGauges();
        }

        gaugeMaster.createGauges = function()
        {
            this.clapGauge = this.createGauge("clapNumber", "Clap 'O Meter");
            this.clapGauge.render(); //It'll break if you don't render it before redrawing
        }

        gaugeMaster.update = function(value) {
            if(value < this.clapGauge.config.min) value = this.clapGauge.config.min;
            else if(value > this.clapGauge.config.max) value = this.clapGauge.config.max;
            this.clapGauge.redraw(value);
        }
        gaugeMaster.initialize();
        return gaugeMaster;
    };
    return {
        createGaugeMaster: createGaugeMaster
    };
});