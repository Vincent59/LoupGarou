import {Component, OnInit} from '@angular/core';
import * as io from 'socket.io-client';
import {Joueur} from './Joueur/Joueur';
import {ChatElementComponent} from './Chat/chatElement.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})

export class AppComponent implements OnInit {
    private socket: any;

    private joueurs: Joueur[] = [];
    private currentJoueur: Joueur = new Joueur();
    private nombreDeJoueurs = 0;
    private errorDoublon = "";
    private erreurIp = "";
    private loop = 0;
    public loopDeux = 0;
    private start = false;
    private nbLoups = 0;
    private nbGentil = 0;
    private partieStart = false;
    private server;

    private chatElementComponent = new ChatElementComponent();

    private roles = [];
    private nbVillageois = 0;

    ngOnInit(): void {
        //192.168.43.39
        this.socket = io('http://localhost:3005'); //localhost en local

        this.server = new Joueur();
        this.server.setPseudo("Serveur");

        this.socket.on('partieEnCours', function (data) {
            document.querySelector("#inscription").remove();
            document.getElementById("spectateur").style.display = "block";
            document.getElementById("room").style.display = "inline-block";
        });

        this.socket.on('getJoueurs', function (data) {
            if (this.loop != 0) {
                if (this.errorDoublon == "" && this.erreurIp == "") {
                    document.querySelector("#inscription").remove();
                    document.getElementById("role").style.display = "block";
                    document.getElementById("room").style.display = "inline-block";
                }
            }
            this.loop++;
        }.bind(this));

        this.socket.on('erreurDoublon', function (data) {
            this.errorDoublon = data.message;
        }.bind(this));

        // this.socket.on('erreurIp',function(data){ //a deco en local
        //   this.erreurIp = data.message; //a deco en local
        // }.bind(this)); //a deco en local

        this.socket.on('joueurs', function (data) {
            var loopDeux = this.loopDeux;
            var pseudoJoueur = this.currentJoueur;
            var tmp = [];
            console.log(data.tabJoueur);
            data.tabJoueur.forEach(function (e, i) {
                var j = new Joueur();
                j.setPseudo(e.pseudo);
                j.setIp(e.ip);
                j.setRole(e.role);

                if (i == 0) {
                    j.setIsMaster(true);
                }
                tmp.push(j);

            });

            this.joueurs = tmp;

            for (var i = 0; i < this.joueurs.length; i++) {
                if (this.joueurs[i].pseudo == this.currentJoueur.pseudo) {
                    this.currentJoueur.setRole(this.joueurs[i].role);
                }
            }

            this.nombreDeJoueurs = this.joueurs.length;

            if (this.nombreDeJoueurs >= 6) //peut on lancer la partie
            {
                this.start = true;
            }
        }.bind(this));
    }

    addJoueur(pseudo) {
        this.errorDoublon = "";
        this.erreurIp = "";
        this.currentJoueur.setPseudo(pseudo);
        this.chatElementComponent.setJoueur(this.currentJoueur);
        this.socket.emit('newJoueur', {joueur: this.currentJoueur});
    }

    addMessage(message: HTMLInputElement) {
        if (message.value != "") {
            this.chatElementComponent.setJoueur(this.currentJoueur);
            this.chatElementComponent.setMessage(message.value);

            this.socket.emit('newMessage', {message: this.chatElementComponent});

            message.value = null;
        }
    }

    initialisationRoles(voyante, chasseur, petiteFille, cupidon, sorciere) {
        if (voyante) this.roles.push("voyante");
        if (chasseur) this.roles.push("chasseur");
        if (petiteFille) this.roles.push("petiteFille");
        if (cupidon) this.roles.push("cupidon");
        if (sorciere) this.roles.push("sorciere");


        this.roles.push("loup");
        this.nbLoups++;

        switch (this.nombreDeJoueurs) {
            case 6:
                if (this.roles.length != 6) {
                    this.roles.push("loup");
                    this.nbLoups++;
                }
                break;
            case 7:
                this.roles.push("loup");
                this.nbLoups++;
                break;
            default:
                this.roles.push("loup");
                this.roles.push("loup");
                this.nbLoups++;
                this.nbLoups++;
                break;
        }

        var max = this.nombreDeJoueurs - this.roles.length;
        for (var i = 0; i < max; i++) {
            this.roles.push("villageois");
        }

        this.roles = this.shuffle(this.roles);

        for (var i = 0; i < this.nombreDeJoueurs; i++) {
            this.joueurs[i].setRole(this.roles[i]);
        }

        this.socket.emit("updateTabJoueur", this.joueurs);
        this.nbGentil = this.joueurs.length - this.nbLoups;
        this.demarrerLaPartie();
    }

    demarrerLaPartie() {
        this.partieStart = true;
        this.chatElementComponent.setJoueur(this.server);
        this.chatElementComponent.setMessage("La partie commence ...");
        this.socket.emit('newMessage', {message: this.chatElementComponent, start: true});
        console.log(this.joueurs);
        this.boucleJeu();

    }

    boucleJeu() {
        console.log("ICI");
        this.nuit(function () {
            this.nbLoups--;
            console.log(this.nbLoups);
            if (this.nbLoups == 0) {
                this.serveurParle("Les villageois ont gagné");
            } else {
                this.jour(function () {
                    if (this.nbLoups == 0) {
                        this.serveurParle("Les villagois ont gagné")
                    } else {
                        this.boucleJeu();
                    }
                }.bind(this));
            }
        }.bind(this));
    }


    nuit(callback) {
        this.serveurParle("La nuit tombe ...");
        this.serveurParle("La voyante se réveille");
        setTimeout(function () {
            this.serveurParle("Les loups et la petite fille se réveillent");
            setTimeout(function () {
                this.serveurParle("Les loups ont désigné leurs cibles");
                this.serveurParle("La sorcière se réveille");
                setTimeout(function () {
                    console.log("sorcière ok");
                    callback();
                }.bind(this), 15000)
            }.bind(this), 30000)
        }.bind(this), 15000)
    }

    jour(callback) {
        this.serveurParle("Le jour se lève, ... est mort cette nuit");
        this.serveurParle("Les joueurs doivent désigner un joueur à éliminer");
        setTimeout(function () {
            this.serveurParle("Les joueurs ont voté, ... est éliminé");
            callback();
        }.bind(this), 10000);
    }

    serveurParle(message) {
        this.chatElementComponent.setJoueur(this.server);
        this.chatElementComponent.setMessage(message);
        this.socket.emit('newMessage', {message: this.chatElementComponent});
    }


    shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }
}
