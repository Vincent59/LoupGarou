import { Component, Input } from '@angular/core';

@Component({
  selector: 'joueur',
  template: ``
})

export class Joueur
{ 
	@Input() joueur;

	public pseudo;

	public setPseudo(pseudo)
	{
		this.pseudo = pseudo;
	}
}
