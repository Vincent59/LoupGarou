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
  private pseudo;
  
  private joueurs : Joueur[] = [];

  ngOnInit(): void {

    this.socket = io('http://localhost:3005')

    this.socket.on('getJoueurs', function (data) {
          var tmp = data.tabJoueur;
          this.joueurs = data.tabJoueur;
    }.bind(this));
  }

  addJoueur(pseudo){
    var joueur = new Joueur();
    joueur.setPseudo(pseudo);
    console.log(joueur);
    this.socket.emit('newJoueur', { joueur : joueur });
    this.pseudo = pseudo;
  }
}
