/* Author: YOUR NAME HERE
 */

$(document).ready(function () {
    var socket = io.connect();

    socket.on('server_message', function (data) {
        $('#receiver').append('<li>' + data + '</li>');
    });
});