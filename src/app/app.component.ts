import {Component, OnInit} from '@angular/core';
import * as io from 'socket.io-client';
import { Joueur } from './Joueur/Joueur';
import { ChatElementComponent } from './Chat/chatElement.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent implements OnInit{
  private socket:any;

  private joueurs : Joueur[] = [];
  private currentJoueur : Joueur = new Joueur();
  private nombreDeJoueurs = 0;
  private errorDoublon = "";
  private erreurIp = "";
  private loop = 0;
  private start = false;

  private chatElementComponent = new ChatElementComponent();

  private roles = [];
  private nbVillageois = 0;
  private nbLoups = 0;

  ngOnInit(): void {
    //192.168.43.39
    this.socket = io('http://192.168.43.39:3005'); //localhost en local
    this.socket.on('getJoueurs', function (data) {

      if(this.loop != 0){
        if(this.errorDoublon=="" && this.erreurIp=="") {
          document.querySelector("#inscription").remove();
          document.getElementById("room").style.display = "block";
        }
      }
      this.loop++;
    }.bind(this));

    this.socket.on('erreurDoublon',function(data){
      this.errorDoublon = data.message;
    }.bind(this));

    // this.socket.on('erreurIp',function(data){ //a deco en local
    //   this.erreurIp = data.message; //a deco en local
    // }.bind(this)); //a deco en local

    this.socket.on('joueurs', function (data) {
      var tmp = [];
      data.tabJoueur.forEach(function(e,i){
          var j = new Joueur();
          j.setPseudo(e.pseudo);
          j.setIp(e.ip);
          if(i == 0){
            j.setIsMaster(true);
          }
          // console.log(this.currentJoueur);
          // if(this.currentJoueur.pseudo == j.pseudo){
          //   this.currentJoueur.setIsMaster(true);
          // }
          tmp.push(j);
          console.log(j);

      });
      this.joueurs = tmp;
      console.log(this.joueurs);
      this.nombreDeJoueurs = this.joueurs.length;

      if(this.nombreDeJoueurs >= 6) //peut on lancer la partie
      {
          this.start = true;
      }
    }.bind(this));
  }

  addJoueur(pseudo){
    this.errorDoublon = "";
    this.erreurIp = "";
    this.currentJoueur.setPseudo(pseudo);
    this.chatElementComponent.setJoueur(this.currentJoueur);
    this.socket.emit('newJoueur', { joueur : this.currentJoueur });
  }

  addMessage(message: HTMLInputElement){
    if(message.value != "")
    {
        this.chatElementComponent.setJoueur(this.currentJoueur);
        this.chatElementComponent.setMessage(message.value);

        this.socket.emit('newMessage', { message:  this.chatElementComponent });

        message.value = null;
    }
  }

  initialisationRoles(voyante, chasseur, petiteFille, cupidon, sorciere){
      if(voyante) this.roles.push("voyante");
      if(chasseur) this.roles.push("chasseur");
      if(petiteFille) this.roles.push("petiteFille");
      if(cupidon) this.roles.push("cupidon");
      if(sorciere) this.roles.push("sorciere");

      console.log("Avant loup: " + this.roles);

      this.roles.push("loup");

      switch (this.nombreDeJoueurs) {
            case 6:
              if(this.roles.length != 6)
              {
                this.roles.push("loup");
              }
              break;
            case 7:
              this.roles.push("loup");
              break;
            default:
              this.roles.push("loup");
              this.roles.push("loup");
              break;
          }

      var max = this.nombreDeJoueurs - this.roles.length;
      for (var i = 0; i < max; i++) {
             this.roles.push("villageois");
      }

      this.roles = this.shuffle(this.roles);

      for (var i =  0; i < this.nombreDeJoueurs; i++) {
            this.joueurs[i].setRole(this.roles[i]);
     }
  }


  shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
}
