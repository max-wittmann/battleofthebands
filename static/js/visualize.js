require(['customGauge'], function(customGaugeBuilder) {
$(document).ready(function () {
    var curClaps = 0;
    var updateTime = 500;
    var idsSeenSinceLastUpdate = {};
    var clapPerAudienceLimit = 3;

    var socket = io.connect();

    var gaugeMaster = customGaugeBuilder.createGaugeMaster();
    gaugeMaster.initialize();

    socket.on('server_message', function (data) {
        if(!idsSeenSinceLastUpdate.hasOwnProperty(data.id) || idsSeenSinceLastUpdate[data.id] < clapPerAudienceLimit)
        {
            curClaps++;
            console.log("Seen " + idsSeenSinceLastUpdate[data.id] + " claps");
            if(idsSeenSinceLastUpdate.hasOwnProperty(data.id))
                idsSeenSinceLastUpdate[data.id]++;
            else
                idsSeenSinceLastUpdate[data.id] = 1;
        }
    });

    setInterval(function(){
        gaugeMaster.update(curClaps);
        curClaps = 0;
        idsSeenSinceLastUpdate = {};
    },updateTime);
})
});