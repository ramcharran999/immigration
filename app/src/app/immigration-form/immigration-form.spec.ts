import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImmigrationForm } from './immigration-form';

describe('ImmigrationForm', () => {
  let component: ImmigrationForm;
  let fixture: ComponentFixture<ImmigrationForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImmigrationForm],
    }).compileComponents();

    fixture = TestBed.createComponent(ImmigrationForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
