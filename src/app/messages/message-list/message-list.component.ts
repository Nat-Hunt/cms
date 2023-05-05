import { Component } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent {
  messages: Message[] = [
    new Message(1, 'test1', 'this is the first test', 'Nathan'),
    new Message(2, 'test2', 'this is the second test', 'Nathan'),
    new Message(3, 'test3', 'this is the third test', 'Nathan'),
  ]
  
  onAddMessage(message: Message){
    this.messages.push(message)
  }
  

}
