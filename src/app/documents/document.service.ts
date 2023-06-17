import { Injectable, EventEmitter } from '@angular/core';
import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private documentDatabaseUrl: string = 'https://wdd430-cms-4efbe-default-rtdb.firebaseio.com/documents.json';
  private documents: Document[] = [];
  maxDocumentId: number;

  documentSelectedEvent = new EventEmitter<Document>();
  documentChangedEvent = new EventEmitter<Document[]>();
  documentListChangedEvent = new Subject<Document[]>();

  constructor(
    private http: HttpClient,
  ) {
    this.documents = MOCKDOCUMENTS;
    this.maxDocumentId = this.getMaxId();
  }

  getMaxId(): number {
    let maxId = 0;

    for (let document of this.documents) {
      let currentId = +document.id;
      if (currentId > maxId) {
        maxId = currentId;
      }
    }

    return maxId;
  }

  storeDocuments() {
    const documents = JSON.stringify(this.documents);
    let httpHeaders = new HttpHeaders;
    httpHeaders.set('Content-type', 'application/json');
    this.http
      .put(this.documentDatabaseUrl, documents, { headers: httpHeaders})
      .subscribe(() => {
        let documentsListClone = this.documents.slice();
        this.documentListChangedEvent.next(documentsListClone);
      });
  }

  getDocuments() {
    this.http
      .get<Document[]>(this.documentDatabaseUrl)
      .subscribe(
        (documents: Document[]) => {
          this.documents = documents;
          this.maxDocumentId = this.getMaxId();
          
          documents.sort((a, b)=> {
            if (a.name > b.name) {
              return 1;
            } else {
              return -1;
            }
          })
          
          let documentsListClone = this.documents.slice();
          this.documentListChangedEvent.next(documentsListClone);
        },
        (error: any) => {
          console.log(error);
        }
      );
  }

  getDocument(id: string): Document {
    for (let document of this.documents) {
      if (document.id === id) {
        return document;
      }
    }
    return null!;
  }

  deleteDocument(document: Document) {
    if (!document) {
      return;
    }

    const pos = this.documents.indexOf(document);
    if (pos < 0) {
      return;
    }

    this.documents.splice(pos, 1);
    this.storeDocuments();
  }

  addDocument(newDocument: Document) {
    if (!newDocument) {
      return
    }

    this.maxDocumentId ++
    newDocument.id = "" + this.maxDocumentId;
    this.documents.push(newDocument);
    this.storeDocuments();
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) {
      return;
    }

    let pos = this.documents.indexOf(originalDocument);
    if (pos < 0) {
      return;
    }

    newDocument.id = originalDocument.id;
    this.documents[pos] = newDocument;
    this.storeDocuments();
  }

}
