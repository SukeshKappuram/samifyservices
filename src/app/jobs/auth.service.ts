import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ICommonModel } from './jobs.component';
import { IJob } from './IJobs';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  securityObject: any;

  constructor(private httpClient: HttpClient) {
    this.securityObject = {
      access_token: '',
      expires: '',
    };
    this.securityObject.access_token =
      window.sessionStorage.getItem('access_token');
  }

  authenticate(user: any): Observable<any> {
    return this.httpClient.post<any>(`http://localhost:3010/api/login`, user);
  }

  logout(): Observable<any> {
    return this.httpClient.post<any>(`http://localhost:3010/api/logout`, null);
  }

  getJobs(): Observable<IJob[]> {
    return this.httpClient.get<IJob[]>(`http://localhost:3010/api/jobs`);
  }

  saveJob(job: IJob): Observable<boolean> {
    return this.httpClient.post<boolean>(
      `http://localhost:3010/api/saveJob`,
      job
    );
  }

  deleteJob(job: any): Observable<boolean> {
    return this.httpClient.post<boolean>(
      `http://localhost:3010/api/deleteJob`,
      job
    );
  }

  register(user: any): Observable<any> {
    return this.httpClient.post<any>(
      `http://localhost:3010/api/register`,
      user
    );
  }

  getData(type: string): Observable<ICommonModel[]> {
    return this.httpClient.get<ICommonModel[]>(`http://localhost:3010/api/getData/${type}`);
  }
}
