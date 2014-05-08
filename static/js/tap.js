/* Author: YOUR NAME HERE
 */

$(document).ready(function () {
    var socket = io.connect();

    $('#sender').bind('click', function () {
        socket.emit('message', 'Message Sent on ' + new Date());
    });

    $("sender").bind("tap", tapHandler);

    function tapHandler(event) {
        socket.emit('message', 'Message Sent on ' + new Date());
    }
});