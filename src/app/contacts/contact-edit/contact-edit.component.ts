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

  onRemoveItem(index: number) {}

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
      value.group
    )

    if (this.editMode) {
      this.contactService.updateContact(this.originalContact, newContact);
    } else {
      this.contactService.addContact(newContact);
    }
    this.router.navigate(['/contacts'], {relativeTo: this.route});
  }
}
