import { Component, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.css']
})
export class MessageEditComponent {
  @ViewChild('msgText') msgTextInput: ElementRef;
  @ViewChild('subject') subjectInput: ElementRef;
  @Output() addMessageEvent = new EventEmitter<Message>();

  currentSender: string = "Nathan";

  onSendMessage(){
    let msgText = this.msgTextInput.nativeElement.value;
    let subject = this.subjectInput.nativeElement.value;

    let newMessage = new Message(123, subject, msgText, this.currentSender);

    this.addMessageEvent.emit(newMessage)
  }
  onClear(){
    this.msgTextInput.nativeElement.value = "";
    this.subjectInput.nativeElement.value = "";
  }
}
 