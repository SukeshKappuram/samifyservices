import { RouterModule, Routes } from '@angular/router';

import { AboutComponent } from './about/about.component';
import { AppComponent } from './app.component';
import { ContactusComponent } from './contactus/contactus.component';
import { HomeComponent } from './home/home.component';
import { JobsComponent } from './jobs/jobs.component';
import { NgModule } from '@angular/core';
import { ServicesComponent } from './services/services.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/',
    pathMatch: 'full'
  },
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'contactus',
    component: ContactusComponent
  },
  {
    path: 'services',
    component: ServicesComponent
  },
  {
    path: 'jobs',
    component: JobsComponent
  },
  {
    path: 'admin-jobs',
    component: JobsComponent,
    data: {
      operationURL: 'admin-jobs'
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash:false})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
