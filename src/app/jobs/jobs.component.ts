import { Component, OnInit } from '@angular/core';

import jobs from './jobs.json';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
export class JobsComponent implements OnInit {

  latestJobs: any;
  query: string = '';
  constructor() { }

  ngOnInit() {
    this.latestJobs = jobs.jobs.map((element: any, index: number) => ({
      ...element,
      showDetails: false
    })).sort((a, b) => b.postedDate.localeCompare(a.postedDate));
  }

  showDetails(index: number) {
    this.latestJobs.map((element: any, i: number) =>{
      if(i === index) {
        console.log(new Date(element.postedDate));
        element.showDetails = !element.showDetails;
      } else {
        element.showDetails = false;
      }
    });
  }

}
