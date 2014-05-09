/* Author: YOUR NAME HERE
 */

$(document).ready(function () {
    var socket = io.connect();

    $('#sender').bind('click', function () {
        socket.emit('message', 'Message Sent on ' + new Date());
    });

    $(window).bind("touchstart touchmove touchend", function(evt){
//        $(box).text(evt.type + ", " + " touchstart called");
        socket.emit('message', 'Message Sent on ' + new Date());
        evt.preventDefault();
        $(box).css("backgroundColor", "blue");
    });

//    $(window).on("touchstart", function(ev) {
//        var e = ev.originalEvent;
//        console.log("Touched " + e.touches);
//    });
//
//    $(window).on("touchend", function(ev) {
//        var e = ev.originalEvent;
//        console.log("Touched " + e.touches);
//    });
//
//    $(window).on("click", function(ev) {
//        var e = ev.originalEvent;
//        console.log("Clicked " + e.touches);
//    });

    $("sender").bind("tap", tapHandler);

    function tapHandler(event) {
        socket.emit('message', 'Message Sent on ' + new Date());
    }
});