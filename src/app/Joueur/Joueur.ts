import { Component, Input } from '@angular/core';

@Component({
  selector: 'joueur',
  template: ``
})

export class Joueur
{ 
	@Input() joueur;
	public pseudo;
	public ip;
	public role;
	public isMort: boolean;

	public setPseudo(pseudo)
	{
		this.pseudo = pseudo;
	}

	public setIp(ip){
	  this.ip = ip;
  	}

  	public setRole(role){
	  this.role = role;
  	}
}
