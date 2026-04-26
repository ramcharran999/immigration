import { TestBed } from '@angular/core/testing';

import { Immigration } from './immigration';

describe('Immigration', () => {
  let service: Immigration;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Immigration);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
