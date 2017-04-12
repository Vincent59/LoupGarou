const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 3005;

app.use(express.static(__dirname));
http.listen(PORT, () => console.log('Le serveur tourne'));

tabJoueur = [];

io.sockets.on('connection', function (socket) {
  socket.emit('getJoueurs', {tabJoueur: tabJoueur});
  
  socket.on('newJoueur', function (data) {
    // tabJoueur.push(data.pseudo);
    // console.log(tabJoueur);
    console.log("new joueur:");
    tabJoueur.push(data.joueur);
    console.log(tabJoueur);

    socket.emit('getJoueurs', {tabJoueur: tabJoueur});
  });
});
