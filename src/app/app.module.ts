import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { Joueur } from './Joueur/Joueur';
import { ChatComponent } from './Chat/chat.component';
import { ChatElementComponent } from './Chat/chatElement.component';
import {ChatLoupComponent} from "./ChatLoup/chatLoup.component";

@NgModule({
  declarations: [
    AppComponent,
    Joueur,
    ChatComponent,
    ChatElementComponent,
    ChatLoupComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule
  ],
  providers: [ ],
  bootstrap: [AppComponent, ChatComponent,ChatLoupComponent]
})
export class AppModule { }
