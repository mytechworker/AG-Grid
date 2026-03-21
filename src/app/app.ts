import { Component } from '@angular/core';
import { GridDemoComponent } from './features/grid-demo/grid-demo.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [GridDemoComponent],
  template: '<app-grid-demo />',
  styles: [':host { display: block; height: 100vh; }']
})
export class App {}
