//Todo: Consider whether the 'clap colorchange' should be sent back from
//server to indicate feedback; that way, the user knows whether claps
//are registering succesfully
$(document).ready(function () {
    var socket = io.connect();
    var myId = -1;

    $('#sender').bind('click', function () {
        socket.emit('message', 'Message Sent on ' + new Date());
    });

//    $(window).bind("touchstart touchmove touchend", function(evt){
    $(window).bind("touchstart click", function(evt){
        if(myId == -1) {
            socket.emit('request_id', {});
            console.log("Requesting id");
        }
        socket.emit('clap', {"id": myId, "time": (new Date()).getTime() });
        evt.preventDefault();
        //Todo: Change this to use class rather than hardcoded styles
        $("#sender").css("backgroundColor", "blue");

        var intervalVar = setInterval(
            function(){
                $("#sender").css("backgroundColor", "green");
                window.clearInterval(intervalVar);
            }, 250);
    });

//    $("sender").bind("tap", tapHandler);
//
//    function tapHandler(event) {
//        socket.emit('message', 'Message Sent on ' + new Date());
//    }

    socket.on('assign_id', function (data) {
        myId = data.id;
        console.log("Got id " + myId);
    });

});