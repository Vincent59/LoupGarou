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
    var present = false;
    tabJoueur.forEach(function(e){
      if(e.pseudo==data.joueur.pseudo){
        present=true;
        socket.emit('erreurDoublon', {message : "Joueur déjà présent"});
      }
    })
    if(!present){
      tabJoueur.push(data.joueur);
    }
    socket.emit('getJoueurs', {tabJoueur: tabJoueur});
  });
});
