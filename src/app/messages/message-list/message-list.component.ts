import { Component, OnInit, OnDestroy } from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../message.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cms-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css'],
  providers: [MessageService]
})
export class MessageListComponent implements OnInit, OnDestroy {
  messages: Message[] = [];
  subscription: Subscription;

  constructor(private messageService: MessageService){};

  ngOnInit(): void {
      this.messageService.getMessages();
      this.subscription = this.messageService.messageListChangedEvent.subscribe(
        (messages: Message[]) => {
          this.messages = messages;
        }
      )
  }

  ngOnDestroy(): void {
      this.subscription.unsubscribe();
  }
}
