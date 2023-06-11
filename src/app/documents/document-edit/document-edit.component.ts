import { Component, OnInit } from '@angular/core';
import { Document } from '../document.model';
import { NgForm } from '@angular/forms';
import { DocumentService } from '../document.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'cms-document-edit',
  templateUrl: './document-edit.component.html',
  styleUrls: ['./document-edit.component.css']
})
export class DocumentEditComponent implements OnInit {
  originalDocument: Document;
  document: Document;
  editMode: boolean = false;

  constructor(private documentService: DocumentService, 
              private router: Router, 
              private route: ActivatedRoute
            ) {}

  onCancel() {
    this.router.navigate(['/documents'], {relativeTo: this.route})
  }

  onSubmit(form: NgForm) {
    let value = form.value;
    let newDocument = new Document(
      value.id,
      value.name,
      value.description,
      value.url,
      value.children
    )

    if (this.editMode) {
      this.documentService.updateDocument(this.originalDocument, newDocument);
    } else {
      this.documentService.addDocument(newDocument);
    }
    this.router.navigate(['/documents'], {relativeTo: this.route})
  }

  ngOnInit(): void {
      this.route.params.subscribe(
        (params: Params) => {
          const id = params['id'];
          if (!id || id === null) {
            this.editMode = false;
            return;
          }
          this.originalDocument = this.documentService.getDocument(id);
          if (!this.originalDocument) {
            return;
          }
          this.editMode = true;
          this.document = JSON.parse(JSON.stringify(this.originalDocument));
        }
      )
  }
}
