import {Component, OnInit, Input} from '@angular/core';
import * as io from 'socket.io-client';
import { ChatElementComponent } from './../chat/chatElement.component';

@Component({
  selector: 'chat-loup',
  templateUrl: 'chatLoup.component.html',
  styleUrls: ['chatLoup.css'],
})

export class ChatLoupComponent implements OnInit{
  private socket:any;
  private messages: ChatElementComponent[] = [];

  ngOnInit(): void {
    //192.168.43.39
    this.socket = io('http://localhost:3005')//localhost en local :)
    this.socket.on('getMessagesLoup', function (data) {
      this.messages = data.tabMessage;
    }.bind(this));
  }
}
