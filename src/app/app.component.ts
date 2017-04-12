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
    this.socket = io('http://localhost:3005');
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

    // this.socket.on('erreurIp',function(data){
    //   this.erreurIp = data.message;
    // }.bind(this));

    this.socket.on('joueurs', function (data) {
      this.joueurs = data.tabJoueur;
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
      
      for (var i = 0; i < (this.nombreDeJoueurs - this.roles.length); i++) {
             this.roles.push("villageois");
      }  

      console.log(this.roles);

      this.roles = this.shuffle(this.roles);  

      console.log(this.roles);
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
