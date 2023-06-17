import { Component, OnInit } from '@angular/core';
import { Contact } from '../contact.model';
import { NgForm } from '@angular/forms';
import { ContactService } from '../contact.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'cms-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrls: ['./contact-edit.component.css']
})
export class ContactEditComponent implements OnInit {
  originalContact: Contact;
  contact: Contact
  groupContacts: Contact[] = [];
  editMode: boolean = false;
  id: string;
  invalidDrop: boolean;

  constructor(
    private contactService: ContactService, 
    private router: Router, 
    private route: ActivatedRoute
    ) {

  }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = params['id']
        if (!this.id || this.id === null) {
          this.editMode = false;
          return;
        }
        this.originalContact = this.contactService.getContact(this.id);
        if (!this.originalContact || this.originalContact === null) {
          return;
        } 
        this.editMode = true;
        console.log(this.originalContact)
        this.contact = JSON.parse(JSON.stringify(this.originalContact));
        if (this.contact.group) {
          this.originalContact.group.forEach((val: Contact) => this.groupContacts.push(Object.assign({}, val)))
          console.log(this.groupContacts);
        }
      }
    )
      
  }

  isInvalidContact(newContact: Contact) {
    if (!newContact) {
      return true;
    }
    if (this.contact && newContact.id === this.contact.id) {
      return true;
    }
    for (let i = 0; i < this.groupContacts.length; i++) {
      if (newContact.id === this.groupContacts[i].id) {
        return true;
      }
    }
    return false;
  }

  addToGroup($event: any) {
    const selectedContact: Contact = $event.dragData;
    const invalidGroupContact = this.isInvalidContact(selectedContact);
    if (invalidGroupContact){
      this.invalidDrop = true;
      return
    }
    this.invalidDrop = false;
    this.groupContacts.push(selectedContact);
  }

  onRemoveItem(index: number) {
    if (index < 0 || index >= this.groupContacts.length) {
      return;
    }
    this.invalidDrop = false;
    this.groupContacts.splice(index, 1);
  }

  onCancel() {
    this.router.navigate(['/contacts'], {relativeTo: this.route});
  }

  onSubmit(form: NgForm) {
    console.log(form);

    let value = form.value;
    let newContact = new Contact(
      value.id,
      value.name,
      value.email,
      value.phone,
      value.imageUrl,
      this.groupContacts
    )

    if (this.editMode) {
      this.contactService.updateContact(this.originalContact, newContact);
    } else {
      this.contactService.addContact(newContact);
    }
    this.router.navigate(['/contacts'], {relativeTo: this.route});
  }
}
