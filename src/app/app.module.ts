import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AboutComponent } from './about/about.component';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { CaptchaComponent } from './captcha/captcha.component';
import { ContactusComponent } from './contactus/contactus.component';
import { DateAgoPipe } from './jobs/date-ago.pipe';
import { HomeComponent } from './home/home.component';
import { HttpInterceptorService } from './http-interceptor.service';
import { JobsComponent } from './jobs/jobs.component';
import {
  MatAutocompleteModule,
} from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { NgModule } from '@angular/core';
import { NgxEditorModule } from "ngx-editor";
import { SearchPipe } from './jobs/search.pipe';
import { ServicesComponent } from './services/services.component';

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    ContactusComponent,
    ServicesComponent,
    HomeComponent,
    JobsComponent,
    SearchPipe,
    DateAgoPipe,
    CaptchaComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatChipsModule,
    MatInputModule,
    NgxEditorModule,
    MatAutocompleteModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
