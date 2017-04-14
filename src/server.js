const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 3005;

app.use(express.static(__dirname));
http.listen(PORT, () => console.log('Le serveur tourne'));

tabJoueur = [];
tabMessage = [];
tabMessageLoup = [];
partieStart = false;


io.sockets.on('connection', function (socket) {
  console.log("partie start: "+partieStart);
  if(!partieStart) {

    socket.emit('getJoueurs', {tabJoueur: tabJoueur});
    socket.emit('getMessages', {tabMessage: tabMessage});

    socket.on('newJoueur', function (data) {
      var present = false;
      ipClient = socket.conn.remoteAddress;
      //data.joueur.ip = ipClient; //a deco en local
      console.log("Nouvelle connection : "+ipClient)
      tabJoueur.forEach(function(e){
        // if(e.ip==data.joueur.ip){ //a deco en local
        //   present=true; //a deco en local
        //   socket.emit('erreurIp',{message : "Cette ip est déjà utilisée."}) //a deco en local
        // } //a deco en local
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
      console.log("data : "+data.start);
      if(data.start==true){
        console.log("1 fois only")
        partieStart = true;
      }
      tabMessage.push(data.message);
      if(tabMessage.length==16){
        tabMessage.shift();
        tabMessage.shift();
        tabMessage.shift();
      }
      io.emit('getMessages', {tabMessage: tabMessage});
    });

    socket.on('newMessageLoup', function (data) {
      tabMessageLoup.push(data.message);
      if(tabMessageLoup.length==16){
        tabMessageLoup.shift();
        tabMessageLoup.shift();
        tabMessageLoup.shift();
      }
      io.emit('getMessagesLoup', {tabMessage: tabMessage});
    });

    socket.on('disconnect', function() {
      ipClient = socket.conn.remoteAddress;
      console.log('disconnect : '+ipClient);
      tabJoueur.forEach(function(e,i){
        if(e.ip==ipClient){
          tabJoueur.splice(i,1);
          console.log(tabJoueur);
          io.emit('joueurs', {tabJoueur: tabJoueur});
        }
      })
    });

    socket.on('updateTabJoueur',function (data) {
      this.tabJoueur = data;
      io.emit('joueurs', {tabJoueur: this.tabJoueur});
    })
  }else{
    socket.emit('partieEnCours', true);
  }
});
