import { Component, ViewChild, ElementRef} from '@angular/core';
import { Message } from '../../message.model';
import { MessageService } from '../../message.service';

@Component({
  selector: 'cms-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.css']
})
export class MessageEditComponent {
  @ViewChild('msgText') msgTextInput: ElementRef;
  @ViewChild('subject') subjectInput: ElementRef;

  currentSender: string = "5";

  constructor(private messageService: MessageService){}

  onSendMessage(){
    const subject = this.subjectInput.nativeElement.value;
    const msgText = this.msgTextInput.nativeElement.value;

    const newMessage = new Message('123', subject, msgText, this.currentSender);

    this.messageService.addMessage(newMessage)
  }
  onClear(){
    this.subjectInput.nativeElement.value = "";
    this.msgTextInput.nativeElement.value = "";
  }
}
