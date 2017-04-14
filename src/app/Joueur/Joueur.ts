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
	public isMaster: boolean = false;
	public nbVote = 0;
	public aVote: string;

	public setPseudo(pseudo)
	{
		this.pseudo = pseudo;
	}

	public setIsMaster(bool){
	  this.isMaster = bool;
  }

	public setIp(ip){
	  this.ip = ip;
  	}

  	public setRole(role){
	  this.role = role;
  	}

  	public setNbVote(vote){
  		this.nbVote = vote;
  	}

  	public setAVote(vote){
  		this.aVote = vote;
  	}

  	public addVote(){
  		this.nbVote++;
  	}

  	public removeVote(){
  		this.nbVote--;
  	}
}
