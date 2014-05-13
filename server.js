var config = require('./config');

//setup Dependencies
var connect = require('connect')
    , express = require('express')
    , io = require('socket.io')
    , requirejs = require('requirejs')
    , lazy = require('lazy')
    , underscore = require('underscore')
    , fs = require('fs')
    , port = (process.env.PORT || 8081);

//Setup Express
var server = express.createServer();
server.configure(function () {
    server.set('views', __dirname + '/views');
    server.set('view options', { layout: false });
    server.use(connect.bodyParser());
    server.use(express.cookieParser());
    server.use(express.session({ secret: "shhhhhhhhh!"}));
    server.use(connect.static(__dirname + '/static'));
    server.use(server.router);
});

auth = express.basicAuth(function (username, password, callback) {
    var result = ((username === config['admin-principal']) &&
        (password === config['admin-password']));
    callback(null, result);
});

//setup the errors
server.error(function (err, req, res, next) {
    if (err instanceof NotFound) {
        res.render('404.jade', { locals: {
            title: '404 - Not Found', description: '', author: '', analyticssiteid: 'XXXXXXX'
        }, status: 404 });
    } else {
        res.render('500.jade', { locals: {
            title: 'The Server Encountered an Error', description: '', author: '', analyticssiteid: 'XXXXXXX', error: err
        }, status: 500 });
    }
});
server.listen(port);

//Setup Socket.IO
var counter = 0;
var recordBuffer = [];
var bandName = underscore.chain(
    underscore.map(config["bandNames"],
        function (num, key) {
            return num;
        })).first().value() || "Undefined band";
var nextId = 0;

var idsSeenSinceLastUpdate = {};
var resetTime = 500;
var clapPerAudienceLimit = 3;
var registeredNames = {};

var io = io.listen(server);

//Todo: Currently this isn't cleaned and would accumulate dead sockets; should clean it out periodically
var idToSocket = {};

//Option to use polling for heroku
console.log("Socket method is " + config.socketMethod);
if (config.socketMethod == "polling") {
    io.configure(function () {
        io.set("transports", ["xhr-polling"]);
        io.set("polling duration", 10);
    });
}

io.sockets.on('connection', function (socket) {
    console.log('Client Connected' + socket);

//    socket.on('requestViz')

    socket.on('clap', function (data) {
        //Ignore things with non-id
        if (data.id != -1) {
            if (!idsSeenSinceLastUpdate.hasOwnProperty(data.id) || idsSeenSinceLastUpdate[data.id] < clapPerAudienceLimit) {
                console.log("Seen " + idsSeenSinceLastUpdate[data.id] + " claps");

                //Increment last-seen (could have this in here instead of as a map, and just check id?)
                if (idsSeenSinceLastUpdate.hasOwnProperty(data.id))
                    idsSeenSinceLastUpdate[data.id]++;
                else
                    idsSeenSinceLastUpdate[data.id] = 1;

                counter++;

                var record = { 'id': socket.id, 'counter': counter, 'time': new Date()};
                recordBuffer.push(record);
                console.log("Got a clap from " + data.id);

                //var serverMessage = JSON.stringify(record);

                //broadcast to original sender and also broadcast message
                //socket.broadcast.emit('server_message', serverMessage);
            }
        }
        else {
            socket.emit("clap_intensity", {"clapIntensity": "none"});
        }
    });

    socket.on('disconnect', function () {
        console.log('Client Disconnected - ' + socket);
        delete idToSocket[socket.id];
    });
});

setInterval(function () {
    var totalClaps = 0;

    //Send clap intensity to clappers so they can adjust their clapping
    for (var id in idsSeenSinceLastUpdate) {
        if (id == -1 || !idToSocket.hasOwnProperty(id))
            continue;

        var socket = idToSocket[id];
        totalClaps += idsSeenSinceLastUpdate[id];
        if (idsSeenSinceLastUpdate[id] == 1) {
            socket.emit("clap_intensity", {"clapIntensity": "low"});
        }
        else if (idsSeenSinceLastUpdate[id] == 2) {
            socket.emit("clap_intensity", {"clapIntensity": "medium"});
        }
        else {
            socket.emit("clap_intensity", {"clapIntensity": "high"});
        }
    }

    io.sockets.emit("visualize_claps", {"nrClaps": totalClaps});

    idsSeenSinceLastUpdate = {};
}, resetTime);

///////////////////////////////////////////
//              Routes                   //
///////////////////////////////////////////

/////// ADD ALL YOUR ROUTES HERE  /////////
server.get('/', function (req, res) {
    res.render('index.jade', {
        locals: {
            title: 'Graph',
            description: 'Displays the graph',
            author: 'Your Name',
            analyticssiteid: 'XXXXXXX',
            currentBand: bandName
        }
    });
});

server.get('/admin', auth, function (req, res) {
    res.render('admin.jade', {
        locals: {
            title: 'Admin page',
            description: 'Admin functions',
            author: 'Your Name',
            analyticssiteid: 'XXXXXXX'
        },
        bandNames: config["bandNames"],
        currentBand: bandName
    });
});

/**
 * Resets the statistics for the competition.
 */
server.post('/admin-reset', auth, function (req, res) {
    init();
    res.setHeader('Content-Type', 'application/json');
    return res.send({'status': 'OK'});
});

/**
 * Re-assigns the currently active band.
 */
server.post('/admin-band-name', auth, function (req, res) {
    bandName = req.body.bandName;
    init();

    res.setHeader('Content-Type', 'application/json');

    return res.send({'status': 'OK', 'message': 'Band name updated'});
});

/**
 * Register a given clapper.
 */
server.post('/register-clapper', function (req, res) {
    var name = req.body.name;
    var sessionId = req.body.sessionId;
    var result = {};

    if (registeredNames[name] == null) {
        registeredNames[name] = true;
        addClapper(sessionId);
        result = {status: 'OK', message: 'Registration completed.', name: name };
    } else {
        result = {status: 'Fail', message: 'Name already registered' };
        res.statusCode = 400;
    }

    res.setHeader('Content-Type', 'application/json');
    return res.send(result);
});

/**
 * Join the list of clappers.
 */
server.post('/join', function (req, res) {
    var name = req.body.name;
    var sessionId = req.body.sessionId;
    var result = {};

    if (registeredNames[name]) {
        addClapper(sessionId);
        result = {status: 'OK', message: 'Join completed.'}
        res.setHeader('Content-Type', 'application/json');
    } else {
        res.statusCode = 400;
        result = {'status': 'Fail', 'message': 'Name ' + name + ' is not registered.'}
    }

    return res.send(result);
});


function addClapper(sessionId) {
    var socket = underscore.find(io.sockets.clients(), function (sock) {
        return sock.id === sessionId;
    });
    idToSocket[sessionId] = socket;
}

server.get('/tap', function (req, res) {
    res.render('tap.jade', {
        locals: {
            title: 'Tap page',
            description: 'Tap away',
            author: 'Your Name',
            analyticssiteid: 'XXXXXXX',
            currentBand: bandName
        }
    });
});

//A Route for Creating a 500 Error (Useful to keep around)
server.get('/500', function (req, res) {
    throw new Error('This is a 500 Error');
});

//The 404 Route (ALWAYS Keep this as the last route)
server.get('/*', function (req, res) {
    throw new NotFound;
});

function NotFound(msg) {
    this.name = 'NotFound';
    Error.call(this, msg);
    Error.captureStackTrace(this, arguments.callee);
}

function init() {
    counter = 0;
    recordBuffer = [];
    //TODO: this should be a new file
    clearInterval();

    io.sockets.emit("update_band", {"currentBand": bandName});
}

function flushEventsToDisk() {
//flush to disk every 500 ms
    setInterval(function () {
        //write to file system for potential replay
        fs.appendFile(buildMessagesFilePath(), JSON.stringify(recordBuffer) + '\n', function (err) {
            if (err) {
                util.error("Failed to write to file.");
            }
            recordBuffer = [];
        });
    }, 5000);
}

function buildMessagesFilePath() {
    return '/tmp/' + bandName + '.txt';
}

console.log('Listening on http://0.0.0.0:' + port);
