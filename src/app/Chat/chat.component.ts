import {Component, OnInit, Input} from '@angular/core';
import * as io from 'socket.io-client';
import { ChatElementComponent } from './chatElement.component';

@Component({
  selector: 'chat-room',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.css'],
})

export class ChatComponent implements OnInit{
  private socket:any;
  private messages: ChatElementComponent[] = [];

  ngOnInit(): void {
    this.socket = io('http://localhost:3005')
    this.socket.on('getMessages', function (data) {
      this.messages = data.tabMessage;
    }.bind(this));
  }
}
