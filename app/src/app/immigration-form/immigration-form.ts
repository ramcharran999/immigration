import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Immigration, ImmigrationData } from '../immigration';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-immigration-form',
  imports: [ReactiveFormsModule, NgForOf],
  templateUrl: './immigration-form.html',
  styleUrl: './immigration-form.scss',
})
export class ImmigrationForm {
  form: FormGroup;

  countries = [
    'Bangladesh', 'Brazil', 'Canada', 'China', 'Ethiopia', 'France',
    'Germany', 'Ghana', 'India', 'Japan', 'Kenya', 'Mexico',
    'Nigeria', 'Pakistan', 'Philippines', 'South Korea',
    'UK', 'Ukraine', 'Vietnam', 'Other',
  ];

  currentYear = new Date().getFullYear();
  // 2000 → current year + 10, newest first so the default is at the top
  years = Array.from(
    { length: this.currentYear + 10 - 2000 + 1 },
    (_, i) => this.currentYear + 10 - i
  );

  constructor(private fb: FormBuilder, private immigration: Immigration) {
    this.form = this.fb.group({
      country: ['', Validators.required],
      study: ['false', Validators.required],
      year: [String(this.currentYear), Validators.required],
      work: ['false', Validators.required],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const raw = this.form.value;
      const data: ImmigrationData = {
        country: raw.country,
        study: raw.study === 'true',
        year: Number(raw.year),
        work: raw.work === 'true',
      };
      this.immigration.setData(data);
    }
  }
}
