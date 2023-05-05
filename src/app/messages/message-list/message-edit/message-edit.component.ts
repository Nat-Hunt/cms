import { Component, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { Message } from '../../message.model';

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
    const subject = this.subjectInput.nativeElement.value;
    const msgText = this.msgTextInput.nativeElement.value;

    const newMessage = new Message(123, subject, msgText, this.currentSender);

    this.addMessageEvent.emit(newMessage);
  }
  onClear(){
    this.subjectInput.nativeElement.value = "";
    this.msgTextInput.nativeElement.value = "";
  }
}
