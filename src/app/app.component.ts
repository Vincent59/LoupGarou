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
  private errorDoublon = "";
  private erreurIp = "";
  private loop = 0;
  private start = false;

  private chatElementComponent = new ChatElementComponent();

  ngOnInit(): void {
    this.socket = io('http://192.168.43.39:3005');
    this.socket.on('getJoueurs', function (data) {

      if(this.loop != 0){
        if(this.errorDoublon=="" && this.erreurIp=="") {
          document.querySelector("#inscription").remove();
          document.getElementById("room").style.display = "block";
          if (this.joueurs.length >= 6) //peut on lancer la partie
          {
            this.start = true;
          }
        }
      }
      this.loop++;
    }.bind(this));

    this.socket.on('erreurDoublon',function(data){
      this.errorDoublon = data.message;
    }.bind(this));

    this.socket.on('erreurIp',function(data){
      this.erreurIp = data.message;
    }.bind(this));

    this.socket.on('joueurs', function (data) {
      this.joueurs = data.tabJoueur;
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
}
