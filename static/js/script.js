/* Author: YOUR NAME HERE
 */

$(document).ready(function () {

    var socket = io.connect();

    $('#sender').bind('click', function () {
        socket.emit('message', 'Message Sent on ' + new Date());
    });

    socket.on('server_message', function (data) {
        $('#receiver').append('<li>' + data + '</li>');
    });

    socket.on('server_news_message', function (data) {
        $('#receiver').append('<li>News: ' + data + '</li>');
    });

    $("sender").bind("tap", tapHandler);

    function tapHandler(event) {
        socket.emit('message', 'Message Sent on ' + new Date());
    }
});