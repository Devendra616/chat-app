require("dotenv").config(); //must be first line
const PORT = process.env.PORT || 3000;
const express = require("express");
const mongoose = require("mongoose");
// error handling middleware
const handleErrors = require("./middlewares/handleError");
const { BadRequest, NotFound } = require("./helper/error");
require("./config/mongo.js");
const app = express();
//moment js
var moment = require("moment");
//socket.io needs http
var http = require("http").createServer(app);

//tell express to use static content from public
app.use(express.static(__dirname + "/public"));
// INFO : method inbuilt in express to recognize the incoming Request Object as a JSON Object.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
const indexRouter = require("./routes/index");
const userRouter = require("./routes/user");
const roomRouter = require("./routes/room");
const deleteRouter = require("./routes/delete");
// middlewares
const { decode } = require("./middlewares/jwt.js");

var clientInfo = {};
//socket io module
var io = require("socket.io")(http);

app.use("/", indexRouter);
app.use("/users", userRouter);
app.use("/room", decode, roomRouter);
app.use("/delete", deleteRouter);

/** If unknown route , catch 404 and forward to error handler */
app.use((req, res, next) => {
  throw new NotFound("API endpoint doesnt exist");
});

//db configuration
/*
const dbUrl = "mongodb+srv://dev:Ld2p7dIGYpcFrXFX@chatapp.hc2jt.mongodb.net/chat-app-db?retryWrites=true&w=majority";
 mongoose.connect(dbUrl, {useNewUrlParser:true,useUnifiedTopology: true },(err,msg) =>{
    if(err){
        console.log("Error connection db! ", err);
    }else {
        console.log("Connected to db! ");
    }
}); */

const Message = mongoose.model("Message", {
  name: String,
  message: String,
});

app.get("/", function (req, res, next) {
  res.sendFile(__dirname + "/index2.html");
});

app.get("/messages", async (req, res, next) => {
  await Message.find({}, (err, messages) => {
    res.send(messages);
  });
});

app.post("/messages", async (req, res, next) => {
  try {
    const message = new Message(req.body);
    await message.save();
    res.sendStatus(500);
  } catch (error) {
    res.sendStatus(200);
  }
});

app.get("/logout", (req, res, next) => {});

// Listen on connection event for incoming sockets
io.on("connection", function (socket) {
  //emits an event to self
  socket.emit("message", {
    text: "Welcome to Chat Appliction !",
    timestamp: moment().valueOf(),
    name: "System",
  });

  // listen or joinRoom socket event trigger
  //req is {name:'',room:''}
  socket.on("joinRoom", function (req) {
    clientInfo[socket.id] = req;
    socket.join(req.room);
    //broadcast new user joined room
    socket.broadcast.to(req.room).emit("message", {
      name: "System",
      text: req.name + " has joined",
      timestamp: moment().valueOf(),
    });
  });

  //handle new message from client
  socket.on("message", function (msg) {
    msg.timestamp = moment().valueOf();

    //broadcast to all clients in same room
    socket.broadcast.to(clientInfo[socket.id].room).emit("message", msg);
  });

  // check if user has seen Message
  socket.on("userSeen", function (msg) {
    socket.broadcast.to(clientInfo[socket.id].room).emit("userSeen", msg);
  });

  // Show who is typing Message
  socket.on("typing", function (message) {
    // broadcast this message to all users in that room
    socket.broadcast.to(clientInfo[socket.id].room).emit("typing", message);
  });
  /* 
  Triggers when client disconnects
*/
  socket.on("disconnect", function () {
    var userdata = clientInfo[socket.id];
    if (typeof (userdata !== undefined)) {
      socket.leave(userdata.room); // leave the room
      //broadcast leave room to only memebers of same room
      socket.broadcast.to(userdata.room).emit("message", {
        text: userdata.name + " has left",
        name: "System",
        timestamp: moment().valueOf(),
      });
      // delete user data-
      delete clientInfo[socket.id];
    }
  });
});

// send current users to provided sockets
function sendCurrentUsers(socket) {
  // loading current users
  var info = clientInfo[socket.id];
  var users = [];
  if (typeof info === "undefined") {
    return;
  }
  // filter name based on rooms
  Object.keys(clientInfo).forEach(function (socketId) {
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
    text: "Current Users : " + users.join(", "),
    timestamp: moment().valueOf(),
  });
}

/*  
  Express error handling middleware
  error handling middlewar must be last among other middleware and routes
 */
app.use(handleErrors);

//NOTE: using http.listen, socket requires http connection not express connection
http.listen(PORT, () => {
  console.log(`Server started at port: ${PORT}`);
  console.log(`http:/localhost:${PORT}`);
});
