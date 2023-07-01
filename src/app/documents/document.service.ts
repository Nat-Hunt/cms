import { Injectable, EventEmitter } from '@angular/core';
import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { response } from 'express';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private documentDatabaseUrl: string = 'https://localhost:3000/documents';
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
          
          this.documents.sort((a, b)=> {
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

    const pos = this.documents.findIndex(d => d.id === document.id);
    if (pos < 0) {
      return;
    }

    this.http.delete(`${this.documentDatabaseUrl}/${document.id}`).subscribe(() => {
      this.documents.splice(pos, 1);
      this.storeDocuments();
    })
  }

  addDocument(newDocument: Document) {
    if (!newDocument) {
      return
    }

    newDocument.id = "";
    const headers = new HttpHeaders({'Content-Type':'application/json'});

    this.http.post<{message: string, document: Document }>(this.documentDatabaseUrl, newDocument, {headers: headers}).subscribe((responseData) => {
      this.documents.push(responseData.document);
      this.storeDocuments();
    })
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) {
      return;
    }

    // const pos = this.documents.indexOf(originalDocument);
    const pos = this.documents.findIndex(d => d.id === originalDocument.id);
    if (pos < 0) {
      return;
    }

    newDocument.id = originalDocument.id;
    newDocument._id = originalDocument._id;

    const headers = new HttpHeaders({'Content-type': 'application/json'});
    this.http.put(`${this.documentDatabaseUrl}/${originalDocument.id}`, newDocument, { headers: headers}).subscribe(() => {
      this.documents[pos] = newDocument;
      this.storeDocuments();
    })
  }

}
