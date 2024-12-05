import { AboutComponent } from './about/about.component';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { ContactusComponent } from './contactus/contactus.component';
import { DateAgoPipe } from './jobs/date-ago.pipe';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { JobsComponent } from './jobs/jobs.component';
import { NgModule } from '@angular/core';
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
      DateAgoPipe
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
