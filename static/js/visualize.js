require(['customGauge'], function(customGaugeBuilder) {
$(document).ready(function () {
    var curClaps = 0;
    var updateTime = 500;

    var socket = io.connect();

    var gaugeMaster = customGaugeBuilder.createGaugeMaster();
    gaugeMaster.initialize();

    socket.on('server_message', function (data) {
        curClaps++;
    });

    setInterval(function(){
        console.log("Calling transition");
        gaugeMaster.update(curClaps);
        curClaps = 0;
    },updateTime);
})
});