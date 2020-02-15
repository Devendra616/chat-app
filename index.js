const PORT = process.env.PORT ||3000;
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
//moment js
var moment = require("moment");
//socket.io needs http
var http = require("http").createServer(app);

var clientInfo = {};

//socket io module
var io = require("socket.io")(http);
//tell express to use static content from public
app.use(express.static(__dirname+'/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

/* const dbUrl = "mongodb://devendra:A1359chatapp@ds337718.mlab.com:37718/mlab-chat-app";
mongoose.connect(dbUrl, (err,msg) =>{
    if(err){
        console.log("Error connection db! ", err);
    }else {
        console.log("Connected to db! ");
    }
}); */

/* const Message = mongoose.model('Message',{
    name:String,
    message:String
});
 */
app.get('/', function(req, res){
    //res.sendFile(__dirname + '/index.html');
    res.sendFile('index.html');
});

// Listen on connection event for incoming sockets
io.on('connection',function(socket){
  console.log('connected on index called');
 //emits an event to self 
  socket.emit("message", {
    text: "Welcome to Chat Appliction !",
    timestamp: moment().valueOf(),
    name: "System"
  });

   // listen ot joinRoom socket event trigger
   //req is {name:'',room:''}
   socket.on('joinRoom', function(req) {
    
    clientInfo[socket.id] = req;
    socket.join(req.room);
    //broadcast new user joined room
    socket.broadcast.to(req.room).emit("message", {
      name: "System",
      text: req.name + ' has joined',
      timestamp: moment().valueOf()
    });
  });

  //handle new message from client
  socket.on('message',function(msg){
      msg.timestamp = moment().valueOf();
      
    //broadcast to all clients in same room
    socket.broadcast.to(clientInfo[socket.id].room).emit("message", msg);      
  });

  // check if user has seen Message
  socket.on("userSeen", function(msg) {
    socket.broadcast.to(clientInfo[socket.id].room).emit("userSeen", msg);    
  });

});

app.get('/messages', (req, res) => {
    Message.find({},(err, messages)=> {
      res.send(messages);
    })
  });

app.post('/messages', (req, res) => {
    const message = new Message(req.body);
    message.save((err) =>{
        if(err) {
            sendStatus(500);
        } else{
            sendStatus(200);
        }
        
    });
});  

// send current users to provided sockets
function sendCurrentUsers(socket) { // loading current users
    var info = clientInfo[socket.id];
    var users = [];
    if (typeof info === 'undefined') {
      return;
    }
    // filter name based on rooms
    Object.keys(clientInfo).forEach(function(socketId) {
      var userinfo = clientInfo[socketId];
      // check if user room and selcted room same or not
      // as user should see names in only his chat room
      if (info.room == userinfo.room) {
        users.push(userinfo.name);
      }  
    });
    // emit message when all users listed
   socket.emit("message", {
    name: "System",
    text: "Current Users : " + users.join(', '),
    timestamp: moment().valueOf()
  });
}

//NOTE: using http.listen, socket requires http connection not express connection
http.listen(PORT, ()=>{ 
    console.log(`Server started at port: ${PORT}`);
});