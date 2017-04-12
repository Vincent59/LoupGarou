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

  ngOnInit(): void {

    this.socket = io('http://localhost:3005')

    this.socket.on('getJoueurs', function (data) {
          var tmp = data.tabJoueur;
          this.joueurs = data.tabJoueur;
    }.bind(this));
  }

  addJoueur(pseudo){
    this.currentJoueur.setPseudo(pseudo);
    this.socket.emit('newJoueur', { joueur : this.currentJoueur });
  }
}
