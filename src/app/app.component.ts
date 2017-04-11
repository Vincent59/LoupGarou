import {Component, OnInit} from '@angular/core';
import * as io from 'socket.io-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{
  private socket:any;


  ngOnInit(): void {
    this.socket = io('http://localhost:3005')
    this.socket.on('news', function (data) {
      console.log(data);
    });
  }
  pseudo = '';
  addJoueur(pseudo){
    this.socket.emit('newJoueur', { pseudo : pseudo});
    this.pseudo = pseudo;
  }
}
