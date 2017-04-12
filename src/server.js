const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 3005;

app.use(express.static(__dirname));
http.listen(PORT, () => console.log('Le serveur tourne'));

tabJoueur = [];
tabMessage = [];

io.sockets.on('connection', function (socket) {
  console.log("Nouvelle connection")
  socket.emit('getJoueurs', {tabJoueur: tabJoueur});
  socket.emit('getMessages', {tabMessage: tabMessage});

  socket.on('newJoueur', function (data) {
    var present = false;
    ipClient = socket.conn.remoteAddress;
    data.joueur.ip = ipClient;
    tabJoueur.forEach(function(e){
      if(e.ip==data.joueur.ip){
        present=true;
        socket.emit('erreurIp',{message : "Cette ip est déjà utilisée."})
      }
      if(e.pseudo==data.joueur.pseudo){
        present=true;
        socket.emit('erreurDoublon', {message : "Joueur déjà présent."});
      }
    })
    if(!present){
      tabJoueur.push(data.joueur);
    }
    socket.emit('getJoueurs', {tabJoueur: tabJoueur});
    io.emit('joueurs', {tabJoueur: tabJoueur});
  });

  /* Messages chat room */
  socket.on('newMessage', function (data) {
  		tabMessage.push(data.message);
  		if(tabMessage.length==16){
  			console.log("oui");
  			console.log("avant 3 array shift: " + tabMessage);
  			tabMessage.shift();
  			tabMessage.shift();
  			tabMessage.shift();
  			console.log("apres 3 array shift: " + tabMessage);
  		}

  		io.emit('getMessages', {tabMessage: tabMessage});
  });


});
