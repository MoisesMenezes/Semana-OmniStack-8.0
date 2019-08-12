const express = require('express');
const mongoose = require('mongoose');

const cors = require('cors');

const routes = require('./routes');

const app = express();
const server= require('http').Server(app);
const io = require('socket.io')(server);

const connectdUsers = {};

io.on('connection', socket => {
  const { user } = socket.handshake.query;

  console.log(user, socket.id);

  connectdUsers[user] = socket.id;
});

mongoose.connect('mongodb+srv://omnistack:32816925@cluster0-s2zgp.mongodb.net/oministack8?retryWrites=true&w=majority',{
  useNewUrlParser: true
});

app.use((req, res, next) => {
  req.io = io;
  req.connectedUsers = connectdUsers;

return next();
});

//Precisa ser antes das routes para usar JSON
app.use(cors());
app.use(express.json());
app.use(routes);

server.listen(3333);