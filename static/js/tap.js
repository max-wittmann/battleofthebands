/* Author: YOUR NAME HERE
 */

$(document).ready(function () {
    var socket = io.connect();

    $('#sender').bind('click', function () {
        socket.emit('message', 'Message Sent on ' + new Date());
    });

//    $(window).bind("touchstart touchmove touchend", function(evt){
    $(window).bind("touchstart click", function(evt){
//        socket.emit('message', 'Message Sent on ' + new Date());
        socket.emit('message', {"id": 0, "time": (new Date()).getTime() });
        evt.preventDefault();
        $(box).css("backgroundColor", "blue");
    });

    $("sender").bind("tap", tapHandler);

    function tapHandler(event) {
        socket.emit('message', 'Message Sent on ' + new Date());
    }
});