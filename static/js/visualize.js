/* Author: YOUR NAME HERE
 */

require(['customGauge'], function(customGaugeBuilder) {
$(document).ready(function () {
    var curClaps = 0;
    var updateTime = 500;

    var socket = io.connect();

//    var gaugeMaster = require(['customGauge']).createGaugeMaster();
//    console.log("CustomGauge is " + require(['customGauge']));
    console.log("CustomGaugeBuilder is " + customGaugeBuilder);
    var gaugeMaster = customGaugeBuilder.createGaugeMaster();
    console.log(gaugeMaster);

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