$(document).ready(function () {
    var socket = io.connect();
    var myId = -1;
    var curClapIntensity = 'none';

    $(window).bind("touchstart click", function(evt){
        function applyUIClapFeedback(clapIntensity) {
            $("body").removeClass("highIntensity mediumIntensity lowIntensity noIntensity");
            $("body").addClass(getClapIntensityClass(clapIntensity));

            var intervalVar = setInterval(
                function(){
                    $("body").addClass("noIntensity");
                    $("body").removeClass("highIntensity mediumIntensity lowIntensity");
                    window.clearInterval(intervalVar);
                }, 400
            );
        }

        function getClapIntensityClass(clapIntensity) {
            var clapColor = '';

            if(clapIntensity == 'high')
            {
                clapColor = 'highIntensity';
            }
            else if(clapIntensity == 'medium') {
                clapColor = 'mediumIntensity';
            }
            else if(clapIntensity == 'low') {
                clapColor = 'lowIntensity';
            }
            else {
                clapColor =  'noIntensity'
            }

            return clapColor;
        }

        function requestIdIfNotAssigned() {
            if(myId == -1) {
                socket.emit('request_id', {});
                console.log("Requesting id");
            }
        }

        function sendClapToServer(socket, id) {
            socket.emit('clap', {"id": id, "time": (new Date()).getTime() });
        }

        evt.preventDefault();
        /*
        Note that this is asynchrnous; the clap will be lost since it'll be sent with a -1 id.
        We could 'buffer' these until an id is assigned and then bulk-send 'em, but there shouldn't be much lost by just
         ignoring it.
         */
        requestIdIfNotAssigned();
        sendClapToServer(socket, myId);
        applyUIClapFeedback(curClapIntensity);
    });

    socket.on('assign_id', function (data) {
        myId = data.id;
        console.log("Got id " + myId);
    });

    socket.on('clap_intensity', function(data) {
        console.log("Got " + data.clapIntensity);
        $("#clapIntensity").text(data.clapIntensity);
        curClapIntensity = data.clapIntensity;
        setInterval(createUpdateTextInterval("#clapIntensity"), 500);
    });

    function createUpdateTextInterval(selector, text) {
        var intervalFunc = function() {
            $(selector).text(text);
            window.clearInterval(intervalFunc);
        };
        return intervalFunc;
    }
});