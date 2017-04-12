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

  private start = false;

  ngOnInit(): void {

    this.socket = io('http://localhost:3005')

    this.socket.on('getJoueurs', function (data) {
          this.joueurs = data.tabJoueur;
          
          if(this.joueurs.length >= 6) //peut on lancer la partie
          {
              this.start = true;
          }

    }.bind(this));
  }

  addJoueur(pseudo){
    this.currentJoueur.setPseudo(pseudo);
    this.socket.emit('newJoueur', { joueur : this.currentJoueur });

    if(this.joueurs.length >= 6)
    {
        this.start = true;
    }
  }
}
