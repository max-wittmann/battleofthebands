//Todo: Consider whether the 'clap colorchange' should be sent back from
//server to indicate feedback; that way, the user knows whether claps
//are registering succesfully
$(document).ready(function () {
    var socket = io.connect();
    var myId = -1;
    var curClapIntensity = 'none';

    $('body').bind('click', function () {
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
//        $("body").css("backgroundColor", "blue");
        $("body").addClass("noIntensity");


        var clapColor = 'noIntensity';
        if(curClapIntensity == 'high')
        {
            clapColor = 'highIntensity';
        }
        else if(curClapIntensity == 'medium') {
            clapColor = 'mediumIntensity';
        }
        else if(curClapIntensity == 'low') {
            clapColor = 'lowIntensity';
        }
        else {

        }
        $("body").removeClass("highIntensity mediumIntensity lowIntensity noIntensity");
        $("body").addClass(clapColor);

        var intervalVar = setInterval(
            function(){
//                $("body").css("backgroundColor", clapColor);
                $("body").addClass("noIntensity");
                $("body").removeClass("highIntensity mediumIntensity lowIntensity");
                window.clearInterval(intervalVar);
            }, 400
        );
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

    socket.on('clap_intensity', function(data) {
        console.log("Got " + data.clapIntensity);
      $("#clapIntensity").text(data.clapIntensity);
      curClapIntensity = data.clapIntensity;
//       if(data.clapIntensity == 'high') {
//           $("#sender").css("backgroundColor", "red");
//       }
//       else if(data.clapIntensity == 'medium') {
//           $("#sender").css("backgroundColor", "yellow");
//       }
//       else if(data.clapIntensity == 'low') {
//           $("#sender").css("backgroundColor", "blue");
//       }
//       else {
//           $("#sender").css("backgroundColor", "black");
//       }
       setInterval(createUpdateTextInterval("#clapIntensity"), 500);
    });

    function createUpdateTextInterval(selector, text) {
        var intervalFunc = function() {
            $(selector).text(text);
            window.clearInterval(intervalFunc);
        };
        return intervalFunc;
    }

//    function createBackgroundChangeInterval(color) {
//        var intervalFunc = function() {
//            $("#sender").css("backgroundColor", color);
//            window.clearInterval(intervalFunc);
//        };
//        return intervalFunc;
//    }

});