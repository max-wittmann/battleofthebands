require(['customGauge'], function(customGaugeBuilder) {
$(document).ready(function () {
//    var curClaps = 0;
//    var updateTime = 500;

    var socket = io.connect();

    var gaugeMaster = customGaugeBuilder.createGaugeMaster();
    gaugeMaster.initialize();

//    socket.on('server_message', function (data) {
//        curClaps++;
//    });

    socket.on('visualize_claps', function (data) {
        gaugeMaster.update(data.nrClaps);
    });


//    setInterval(function(){
//        gaugeMaster.update(curClaps);
//        curClaps = 0;
//    },updateTime);
})
});