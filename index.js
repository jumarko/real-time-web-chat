var express = require("express");
var app = express();
var port = 3700;

// Required configuration for using Jade with ExpressJS
app.set('views', __dirname + "/tpl");
app.set('view.engine', "jade");
app.engine('jade', require('jade').__express);

app.get("/", function(req, res){
    res.render("page.jade");
});

app.use(express.static(__dirname + '/public'));

var io = require('socket.io').listen(app.listen(port));
// receive message from client and send it to all others
io.sockets.on('connection', function(socket) {
    // welcome message
    socket.emit('message', { message : 'welcome to the chat' });
    // client should emit the message named 'send' which we will catch
    socket.on('send', function(data) {
        // forward data sent by user to all other sockets
        io.sockets.emit('message', data);
    });
});

console.log("Listening on port " + port);
