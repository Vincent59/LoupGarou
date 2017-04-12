import {Component} from '@angular/core';
import * as io from 'socket.io-client';

@Component({
  selector: 'chat-element',
  template: ``
})

export class ChatElementComponent {
	private joueur;
	private message: string;

	setJoueur(joueur){
    	this.joueur = joueur;
  	}
  	
	setMessage(message){
		this.message = message;
	}
}
