import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.css'],
})
export class ContactusComponent implements OnInit {
  contactUsForm!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.contactUsForm = fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: [''],
    });
  }

  ngOnInit() {}

  send(): void {
    if (this.contactUsForm.valid) {
      let info = this.contactUsForm.value;
      location.href = `mailto:info@ryprotechnologies.com?subject=${
        info.subject
      }&body=${
        info.message === '' || !info.message
          ? "Hi! I'm" + info.name
          : info.message
      } )`;
    }
  }

  validateField(fieldName: string): boolean {
    return ((
      this.contactUsForm.get(fieldName)?.invalid &&
      (this.contactUsForm.get(fieldName)?.dirty ||
        this.contactUsForm.get(fieldName)?.touched)
    ) ?? false);
  }
}
