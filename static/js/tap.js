$(document).ready(function () {
    var socket = io.connect();
    var curClapIntensity = 'none';

    socket.on('connect', function () {
        //check if registration exists on FS
        if (!store.enabled) {
            alert('Local storage is not supported by your browser. ' +
                'Please disable "Private Mode", or upgrade to a modern browser.')
        } else {
            var name = store.get('name');

            var sessionid = socket.socket.sessionid;
            if (name) {
                join(name, sessionid);

            } else {
                name = window.prompt("Username: ");
                register(name, sessionid);
            }
        }

        function register(name, sessionid) {
            $.post("register-clapper", {name: name, sessionId: sessionid}, function (data) {

            }).success(function (data) {
                store.set("name", data.name);
                join(data.name, sessionid)
                window.alert("Registration complete - " + JSON.stringify(data));
            }).fail(function (data) {
                window.alert("Please register again - " + JSON.stringify(data));
            });
        }

        /**
         * Join the competition.
         */
        function join(name, sessionId) {
            $.post("join", {name: name, sessionId: sessionId}, function () {
            }).success(function (data) {
                console.log("Joined successfully.");

                $(window).bind("touchstart click", function (evt) {
                    function applyUIClapFeedback(clapIntensity) {
                        $("body").removeClass("highIntensity mediumIntensity lowIntensity noIntensity");
                        $("body").addClass(getClapIntensityClass(clapIntensity));

                        var intervalVar = setInterval(
                            function () {
                                $("body").addClass("noIntensity");
                                $("body").removeClass("highIntensity mediumIntensity lowIntensity");
                                window.clearInterval(intervalVar);
                            }, 400
                        );
                    }

                    function getClapIntensityClass(clapIntensity) {
                        var clapColor = '';

                        if (clapIntensity == 'high') {
                            clapColor = 'highIntensity';
                        }
                        else if (clapIntensity == 'medium') {
                            clapColor = 'mediumIntensity';
                        }
                        else if (clapIntensity == 'low') {
                            clapColor = 'lowIntensity';
                        }
                        else {
                            clapColor = 'noIntensity'
                        }

                        return clapColor;
                    }

                    function sendClapToServer(socket, id) {
                        socket.emit('clap', {"id": id, "time": (new Date()).getTime() });
                    }

                    evt.preventDefault();

                    sendClapToServer(socket, sessionId);
                    applyUIClapFeedback(curClapIntensity);
                });

                socket.on('clap_intensity', function (data) {
                    console.log("Got " + data.clapIntensity);
                    $("#clapIntensity").text(data.clapIntensity);
                    curClapIntensity = data.clapIntensity;
                    setInterval(createUpdateTextInterval("#clapIntensity"), 500);
                });

                socket.on('update_band', function (data) {
                    $("#currentBand").text(data.currentBand);
                });

                socket.on('winner', function(data){
                    alert("Congratulations you are the winner!!")
                });

                socket.on('reset', function() {
                    store.remove('name');
                });

                function createUpdateTextInterval(selector, text) {
                    var intervalFunc = function () {
                        $(selector).text(text);
                        window.clearInterval(intervalFunc);
                    };
                    return intervalFunc;
                }
            }).fail(function (data) {
                alert("Failed to join - " + JSON.stringify(data));
                name = window.prompt("Username: ");
                register(name, sessionid);
            });
        }
    });
});