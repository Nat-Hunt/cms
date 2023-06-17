import { Injectable, EventEmitter } from '@angular/core';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private contactDatabaseUrl: string = 'https://wdd430-cms-4efbe-default-rtdb.firebaseio.com/contacts.json';
  contacts: Contact[] = [];
  maxContactId: number;

  contactSelectedEvent = new EventEmitter<Contact>();
  contactChangedEvent = new EventEmitter<Contact[]>();
  contactListChangedEvent = new Subject<Contact[]>();

  constructor(
    private http: HttpClient,
  ) {
    this.contacts = MOCKCONTACTS;
    this.maxContactId = this.getMaxId();
  }

  getMaxId(): number {
     let maxId = 0;
 
     for (let contact of this.contacts) {
       let currentId = +contact.id;
       if (currentId > maxId) {
         maxId = currentId;
       }
     }
 
     return maxId;
  }
  
  storeContacts() {
    const contacts = JSON.stringify(this.contacts);
    let httpHeaders = new HttpHeaders;
    httpHeaders.set('Content-type', 'application/json');
    this.http
      .put(this.contactDatabaseUrl, contacts, {headers: httpHeaders})
      .subscribe(()=> {
        let contactsListClone = this.contacts.slice();
        this.contactListChangedEvent.next(contactsListClone);
      })
  }

  getContacts() {
    this.http
      .get<Contact[]>(this.contactDatabaseUrl)
      .subscribe(
        (contacts: Contact[]) => {
          this.contacts = contacts;
          this.maxContactId = this.getMaxId();

          contacts.sort((a, b)=> {
            if (a.name > b.name) {
              return 1;
            } else {
              return -1;
            }
          })
          let contactsListClone = this.contacts.slice();
          this.contactListChangedEvent.next(contactsListClone);
        },
        (error: any) => {
          console.log(error);
        }
      )
    
  }

  getContact(id: string): Contact {
    for (let contact of this.contacts) {
      if (contact.id === id) {
        return contact
      }
    }
    return null!;
  }

  deleteContact(contact: Contact) {
    if (!contact) {
      return;
    }

    const pos = this.contacts.indexOf(contact);
    if (pos < 0) {
      return;
    }

    this.contacts.splice(pos, 1);
    this.storeContacts();
  }


  addContact(newContact: Contact) {
    if (!newContact) {
      return
    }

    this.maxContactId ++
    newContact.id = "" + this.maxContactId;
    this.contacts.push(newContact);
    this.storeContacts();
  }

  updateContact(originalContact: Contact, newContact: Contact) {
    if (!originalContact || !newContact) {
      return;
    }

    let pos = this.contacts.indexOf(originalContact);
    if (pos < 0) {
      return;
    }

    newContact.id = originalContact.id;
    this.contacts[pos] = newContact;
    this.storeContacts();
  }

}
