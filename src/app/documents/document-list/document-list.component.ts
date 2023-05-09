import { Component, Output, EventEmitter } from '@angular/core';
import { Document } from '../document.model';

@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent {
  documents: Document[] = [
    new Document(1, 'Test Doc 1', 'This is the first test document', 'fakeUrl', []),
    new Document(2, 'Test Doc 2', 'This is the second test document', 'fakeUrl', []),
    new Document(3, 'Test Doc 3', 'This is the third test document', 'fakeUrl', []),
    new Document(4, 'Test Doc 4', 'This is the fourth test document', 'fakeUrl', []),
    new Document(5, 'Test Doc 5', 'This is the fifth test document', 'fakeUrl', []),
  ]
  @Output() selectedDocumentEvent = new EventEmitter<Document>();

  onSelectedDocument(document: Document){
    this.selectedDocumentEvent.emit(document);
  }

}
