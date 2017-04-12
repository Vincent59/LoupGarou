import {Component, OnInit} from '@angular/core';
import * as io from 'socket.io-client';
import { Joueur } from './Joueur/Joueur';

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
  private loop = 0;

  ngOnInit(): void {

    this.socket = io('http://localhost:3005')

    this.socket.on('getJoueurs', function (data) {
          var tmp = data.tabJoueur;
          this.joueurs = data.tabJoueur;
          if(this.loop != 0){
            console.log("loop");
            console.log(typeof(this.errorDoublon));
            if(this.errorDoublon==""){
              console.log("undefined");
              document.querySelector("#inscription").remove();
              document.getElementById("room").style.display = "block";
            }else{

            }
          }
          this.loop++;
    }.bind(this));

    this.socket.on('erreurDoublon',function(data){
      console.log("ici");
      this.errorDoublon = data.message;
    }.bind(this));
  }

  addJoueur(pseudo){
    this.errorDoublon = "";
    this.currentJoueur.setPseudo(pseudo);
    this.socket.emit('newJoueur', { joueur : this.currentJoueur });
  }
}
