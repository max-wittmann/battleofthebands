require(['customGauge'], function(customGaugeBuilder) {
$(document).ready(function () {
    var curClaps = 0;
    var updateTime = 500;

    var socket = io.connect();

//    console.log("CustomGaugeBuilder is " + customGaugeBuilder);
    console.log("PreGaugeMaster");
    var gaugeMaster = customGaugeBuilder.createGaugeMaster();
    gaugeMaster.initialize();
    console.log("PostGaugeMaster");
//    console.log(gaugeMaster);

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