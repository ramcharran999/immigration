import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImmigrationFlowchart } from './immigration-flowchart';

describe('ImmigrationFlowchart', () => {
  let component: ImmigrationFlowchart;
  let fixture: ComponentFixture<ImmigrationFlowchart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImmigrationFlowchart],
    }).compileComponents();

    fixture = TestBed.createComponent(ImmigrationFlowchart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
