
var http = require('http')
var httpServer = http.createServer()
//iniciar los websockets en el servidor
var io = require('socket.io')(httpServer)

//look up uuid by entiring socket id
var userFromSocket = {}

//lookup socket id by entering uuid
var socketFromUser = {}

//new connection to websocket server
io.on('connection', function (socket) {
   console.log("new connection", socket.id)
   
   
     socket.on('join', function(room, _userData) {
      
       console.log("user", JSON.stringify(_userData))
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
}    );
       
      var peerUuids = peers.map(function(socketId){
        return userFromSocket[socketId]
      })
      
        // Send them to the client
      socket.emit('ready', socket.id, peerUuids)
       
       // And then add the client to the room
      socket.join(room);
    //send updated list of peers to all clients. TODO: only room
     // io.sockets.emit('peers', peerUuids);
      
      
    });

    
  
     socket.on('signal', function(data) {
       console.log("forwarding signal " + JSON.stringify(data))
      var client = io.sockets.connected[socketFromUser[data.id]];
      client && client.emit('signal', {
        id: userFromSocket[socket.id],
        label: socket.label,
        signal: data.signal,
      });
    });


    ///TO DO: on disconnect, remove from label dictionary
});

var LocalSignaling = function (portNum) {
  httpServer.listen(portNum)
}

module.exports = LocalSignaling
