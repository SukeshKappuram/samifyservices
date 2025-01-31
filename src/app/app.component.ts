import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'rypro';
  showTab = 'home';

  view(tabName: string): void {
    this.showTab = tabName ?? 'home';
  }
}
