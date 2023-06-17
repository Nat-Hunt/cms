import { EventEmitter, Injectable } from '@angular/core';
import { Message } from './message.model';
import { MOCKMESSAGES } from './MOCKMESSAGES';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private messageDatabaseUrl: string = 'https://wdd430-cms-4efbe-default-rtdb.firebaseio.com/messages.json';
  private messages: Message[];
  messageChangedEvent = new EventEmitter<Message[]>();
  messageListChangedEvent = new Subject<Message[]>();
  maxMessageId: number;

  constructor(
    private http: HttpClient
  ) {
    this.messages = MOCKMESSAGES;
  }

  getMaxId(): number {
    let maxId = 0;

    for (let message of this.messages) {
      let currentId = +message.id;
      if (currentId > maxId) {
        maxId = currentId;
      }
    }

    return maxId
  }

  storeMessages() {
    const messages = JSON.stringify(this.messages);
    let httpHeaders = new HttpHeaders;
    httpHeaders.set('Content-type', 'application/json');
    this.http
      .put(this.messageDatabaseUrl, messages, {headers: httpHeaders})
      .subscribe(()=> {
        let messageListClone = this.messages.slice();
        this.messageListChangedEvent.next(messageListClone);
      })
  }

  getMessages() {
    this.http
      .get<Message[]>(this.messageDatabaseUrl)
      .subscribe(
        (messages: Message[]) => {
          this.messages = messages;
          this.maxMessageId = this.getMaxId();

          this.messages.sort((a, b)=> {
            if (+a.id > +b.id) {
              return 1;
            } else {
              return -1;
            }
          })
          let messageListClone = this.messages.slice();
          this.messageListChangedEvent.next(messageListClone);
        },
        (error: any) => {
          console.log(error)
        }
      )
  }

  getMessage(id: string): Message {
    for (let message of this.messages) {
      if (message.id === id) {
        return message
      }
    }
    return null!;
  }

  addMessage(message: Message) {
    this.messages.push(message);
    this.storeMessages();
  }

}
