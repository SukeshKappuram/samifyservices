import { COMMA, ENTER, SEMICOLON } from '@angular/cdk/keycodes';
import { Component, OnInit, ViewChild, signal } from '@angular/core';
import {
  Editor,
  Validators as EditorValidators,
  Toolbar,
  toDoc,
  toHTML,
} from 'ngx-editor';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';

import { ActivatedRoute } from '@angular/router';
import { AuthService } from './auth.service';
import { CaptchaComponent } from '../captcha/captcha.component';
import { IJob } from './IJobs';
import { MatChipInputEvent } from '@angular/material/chips';
import editConfig from './editor.config';
import jobsData from './jobs.json';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss'],
})
export class JobsComponent implements OnInit {
  latestJobs: any;
  query: string = '';
  isAdmin: boolean = false;
  isCaptchaValidated = false;
  isUserLoggedIn: boolean = false;
  authKey: string = '';
  protected helperText = signal<string>('');
  protected responseObj = signal<any>(null);
  hasError = false;
  currentJob!: IJob;
  masterData: any = {cities: [], courses: []};
  filteredData: any = {};

  loginForm!: FormGroup;
  jobForm!: FormGroup;

  editordoc = editConfig;

  editor!: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  experiences: number[] = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
  ];

  @ViewChild('captcha') captcha!: CaptchaComponent;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private auth: AuthService
  ) {
    let routeUrl = this.route.snapshot.data['operationURL'];
    this.isAdmin = routeUrl?.toString().includes('admin') ? true : false;
    this.loginForm = fb.group({
      emailAddress: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.auth.getData('cities').subscribe((data: ICommonModel[]) => {
      console.log(data);
      this.masterData['cities'] = data;
    });
    this.auth.getData('courses').subscribe((data: ICommonModel[]) => {
      console.log(data);
      this.masterData['courses'] = data;
    });
  }

  ngOnInit() {
    let isUserLoggedIn = sessionStorage.getItem('isUserLoggedIn') ?? 'false';
    this.isUserLoggedIn = JSON.parse(isUserLoggedIn);
    this.getJobs();
    this.editor = new Editor();

    this.filteredData = {...this.masterData};
    console.log(this.masterData, this.filteredData);
  }

  getJobs(): void {
    this.auth.getJobs().subscribe((jobs: IJob[]) => {
      this.latestJobs =
        (jobs ??
        jobsData.jobs)
          .map((element: any, index: number) => ({
            id: element.id,
            description: JSON.parse(JSON.stringify(element.description)),
            experience: element.experience + ' years and above',
            locations: element.locations,
            postedDate: element.postedDate,
            skills: element.skills,
            title: element.title,
            type: element.type,
            showDetails: false,
            isDeleted: false,
            isCleared: true
          }));
    });
  }

  getDate(obj: any): any {
    return new Date(obj?.seconds * 1000);
  }

  getContent(obj: any): any {
    return obj; //toHTML(obj);
  }

  showDetails(index: number) {
    this.latestJobs.map((element: any, i: number) => {
      if (i === index) {
        element.showDetails = !element.showDetails;
      } else {
        element.showDetails = false;
      }
    });
  }

  validateCaptcha(event: any): void {
    this.isCaptchaValidated = event;
  }

  edit(jobId: number): void {
    this.currentJob = this.latestJobs.find((job: IJob) => job.id === jobId);
    this.modifyJob(this.currentJob);
  }

  saveJob(): void {
    if (this.jobForm.valid) {
      let job = this.jobForm.value;
      job.locations = job.locations;
      job.skills = job.skills;
      job.description = job.description;
      this.auth.saveJob(job).subscribe({
        next: (result: boolean) => {
          if(result) {
            document.getElementById('closePost')?.click();
            this.getJobs();
          }
          this.responseObj.set({
            action : 'post',
            isSuccess: result,
            message: result
              ? 'Job Posted Successfully'
              : 'Error: Could not post the job',
          });
        },
      });
    }
  }

  identify(index: number, item: any){
    return item.id;
 }

  deleteJob(job: IJob): void {
    let jobToDelete = { jobId: job.id };
    console.log(jobToDelete, job);
    this.auth.deleteJob(jobToDelete).subscribe({
      next: (result: boolean) => {
        if(result) {
          let d = this.latestJobs.find((j: IJob) => j.id === job.id);
          d.isDeleted = true;
          d.isCleared = false;
          setTimeout(() => d.isCleared = true, 1000);
        }
        this.responseObj.set({
          action : 'delete',
          isSuccess: result,
          message: result
            ? 'Job deleted Successfully'
            : 'Error: Could not delete the job',
        });
      },
    });
  }

  signup(): void {
    if (this.loginForm.valid) {
      let user = this.loginForm.value;
      this.auth.register(user).subscribe({
        next: (result: any) => {
          console.log(result);
        },
      });
    }
  }

  authenticate() {
    if (this.loginForm.valid) {
      let user = this.loginForm.value;
      this.auth.authenticate(user).subscribe({
        next: (result: any) => {
          this.isUserLoggedIn =
            (result.userCredential ? true : result.isSuccess) ?? false;
          this.authKey =
            result.userCredential?._tokenResponse?.idToken || result.key;
          this.hasError = !result.userCredential || result.hasError;
          this.helperText.set(
            `<strong>User Authenticated !! </strong> ${result.message}`
          );
          sessionStorage.setItem(
            'isUserLoggedIn',
            this.isUserLoggedIn?.toString()
          );
          if (this.isUserLoggedIn) {
            this.auth.securityObject.access_token = this.authKey;
            sessionStorage.setItem('access_token', this.authKey);
          }
        },
        error: (err: any) => {
          this.hasError = err.error.hasError;
          this.isUserLoggedIn = err.error.isSuccess;
          this.helperText.set(
            `<strong>Login Error !! </strong> ${err.error.message}`
          );
        },
      });
    }
  }

  modifyJob(job?: IJob): void {
    this.jobForm = this.fb.group({
      title: [job?.title ?? '', Validators.required],
      description: [
        { value: job?.description ?? '', disabled: false },
        EditorValidators.required(),
      ],
      type: [job?.type ?? 'Permanent', Validators.required],
      locations: [job?.locations?.join('; ') ?? '', Validators.required],
      skills: [job?.skills?.join(', ') ?? '', Validators.required],
      experience: [job?.experience ?? -1, Validators.required],
      postedDate: [job?.postedDate ?? ''],
    });
    this.filteredData.cities = this.jobForm.controls['locations'].valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) =>
        fruit ? this._filter(fruit) : this.filteredData.cities.slice()
      )
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.masterData.cities.filter((fruit: any) =>
      fruit.toLowerCase().includes(filterValue)
    );
  }

  validateField(fieldName: string, againstValue: any = null): boolean {
    let isTouched =
      this.jobForm.get(fieldName)?.dirty ||
      this.jobForm.get(fieldName)?.touched;
    return (
      ((this.jobForm.get(fieldName)?.invalid && isTouched) ||
        (isTouched &&
          (againstValue === null ||
            (againstValue !== null &&
              againstValue === this.jobForm.get(fieldName)?.value)))) ??
      false
    );
  }

  // material

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, SEMICOLON, COMMA];
  readonly separatorKeysCodesForLocations: number[] = [ENTER, SEMICOLON];
  locations: ICommonModel[] = [];
  skills: ICommonModel[] = [];

  add(event: MatChipInputEvent, type: number): void {
    const input = event.input;
    const value = event.value;

    // Add
    if ((value || '').trim()) {
      if (type === 1) {
        this.locations.push({ name: value.trim() });
      } else {
        this.skills.push({ name: value.trim() });
      }
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(obj: ICommonModel, type: number): void {
    const index =
      type === 1 ? this.locations.indexOf(obj) : this.skills.indexOf(obj);

    if (index >= 0) {
      if (type === 1) {
        this.locations.splice(index, 1);
      } else {
        this.skills.splice(index, 1);
      }
    }
  }

  logout(): void{
    this.auth.logout().subscribe({
      next: (result: any) => {
        this.isUserLoggedIn = false;
        this.authKey = '';
        sessionStorage.setItem(
          'isUserLoggedIn',
          this.isUserLoggedIn?.toString()
        );
        sessionStorage.setItem('access_token', this.authKey);
        if (!this.isUserLoggedIn) {
          sessionStorage.removeItem('isUserLoggedIn');
          sessionStorage.removeItem('access_token');
        }
      }
    });
  }
}

export interface ICommonModel {
  name: string;
}
