var fs = require('fs')
var https = require('https')
//iniciar los websockets en el servidor
var options = {
  key: fs.readFileSync(__dirname + '/certs/key.pem'),
  cert: fs.readFileSync(__dirname + '/certs/cert.pem')
}
var httpServer = https.createServer(options, function (req, res) {

// var httpServer = https.createServer( function (req, res) {  
  fs.readFile(__dirname + req.url, 
    // Callback function for reading
    function (err, data) {
      // if there is an error
      if (err) {
        res.writeHead(500)
        return res.end('Error loading url')
      }
      // Otherwise, send the data, the contents of the file
      res.writeHead(200)
      res.end(data)
      }
    )

}).listen(8000)

var io = require('socket.io')(httpServer)

//look up uuid by entiring socket id
var userFromSocket = {}

//lookup socket id by entering uuid
var socketFromUser = {}

var host = []

//new connection to websocket server
io.on('connection', function (socket) {
   console.log("new connection", socket.id)
   
     socket.on('join', function(room, _userData) {
       console.log("user", JSON.stringify(_userData))
      if (Object.keys(userFromSocket).length < 4) {
       if(_userData.uuid){
         userFromSocket[socket.id] = _userData.uuid
         socketFromUser[_userData.uuid] = socket.id
       }
      // Get the list of peers in the room
      var peers = io.nsps['/'].adapter.rooms[room] ?
                Object.keys(io.nsps['/'].adapter.rooms[room].sockets) : []
      
      io.of('/').in(room).clients(function(error, clients){
        if (error) throw error;
      console.log(clients); // => [Anw2LatarvGVVXEIAAAD]
      });      


      if(_userData.nickname == 'host') {
        host.push(_userData.uuid)
        console.log("host", host)
        var peerUuids = peers.map(function(socketId){
          return userFromSocket[socketId]
        })
        // Send them to the client
        socket.emit('ready', socket.id, peerUuids)
      }

      if (_userData.nickname !== 'host') {
        socket.emit('ready', socket.id, host)
        console.log('host to guest', host)
      }

       // And then add the client to the room
      socket.join(room);
      } else {
        socket.emit('status', 'Room is currently full')
        console.log('Room is currently full')
      }
    //send updated list of peers to all clients. TODO: only room
     // io.sockets.emit('peers', peerUuids);
      
      });

     socket.on('signal', function(data) {
      // console.log("forwarding signal " + JSON.stringify(data))
      var client = io.sockets.connected[socketFromUser[data.id]];
      client && client.emit('signal', {
        id: userFromSocket[socket.id],
        label: socket.label,
        signal: data.signal,
      });
    });

     socket.on('disconnect', (reason) => {
      var uuid = userFromSocket[socket.id]
      delete socketFromUser[uuid]
      delete userFromSocket[socket.id]
      console.log("socketFromUser", socketFromUser)
      console.log("userFromSocket", userFromSocket)
      if (host.includes(uuid)) {
        var index = host.indexOf(uuid)
        host.splice(index, 1)
        console.log("host", host)
      } else {console.log("not a host")}
     })
    ///TO DO: on disconnect, remove from label dictionary
});