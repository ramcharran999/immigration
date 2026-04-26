import { Component } from '@angular/core';
import { ImmigrationForm } from './immigration-form/immigration-form';
import { ImmigrationFlowchart } from './immigration-flowchart/immigration-flowchart';

@Component({
  selector: 'app-root',
  imports: [ImmigrationForm, ImmigrationFlowchart],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
