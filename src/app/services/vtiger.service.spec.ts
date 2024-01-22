import { TestBed } from '@angular/core/testing';

import { VtigerService } from './vtiger.service';

describe('VtigerService', () => {
  let service: VtigerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VtigerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
