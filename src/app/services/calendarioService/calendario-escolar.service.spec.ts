import { TestBed } from '@angular/core/testing';
import { CalendarioEscolarService } from './calendario-escolar.service';


describe('CalendarioEscolarService', () => {
  let service: CalendarioEscolarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalendarioEscolarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
