//setup Dependencies
var connect = require('connect')
    , express = require('express')
    , io = require('socket.io')
    , requirejs = require('requirejs')
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
var bandName = 'Dummy';

var io = io.listen(server);

io.sockets.on('connection', function (socket) {
    console.log('Client Connected' + socket);

    socket.on('message', function (data) {
        counter++;
        var record = { 'id': socket.id, 'counter': counter, 'time': new Date()};
        recordBuffer.push(record);

        var serverMessage = JSON.stringify(record);

        //broadcast to original sender and also broadcast message
        socket.broadcast.emit('server_message', serverMessage);
        socket.emit('server_message', serverMessage);
//        flushEventsToDisk();
    });

    socket.on('disconnect', function () {
        console.log('Client Disconnected.');
    });
});

///////////////////////////////////////////
//              Routes                   //
///////////////////////////////////////////

/////// ADD ALL YOUR ROUTES HERE  /////////


server.get('/', function (req, res) {
    res.render('index.jade', {
        locals: {
            title: 'Graph', description: 'Displays the graph', author: 'Your Name', analyticssiteid: 'XXXXXXX'
        }
    });
});

server.get('/admin', function (req, res) {
    res.render('admin.jade', {
        locals: {
            title: 'Admin page', description: 'Admin functions', author: 'Your Name', analyticssiteid: 'XXXXXXX'
        }
    });
});

server.post('/admin-reset', function (req, res) {
    init();
    res.setHeader('Content-Type', 'application/json');
    return res.send({'status': 'OK'});
});

server.post('/admin-band-name', function (req, res) {
    bandName = req.body.bandName;
    init();

    res.setHeader('Content-Type', 'application/json');
    return res.send({'status': 'OK', 'message': 'Band name updated'});
});

server.get('/tap', function (req, res) {
    res.render('tap.jade', {
        locals: {
            title: 'Tap page', description: 'Tap away', author: 'Your Name', analyticssiteid: 'XXXXXXX'
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
