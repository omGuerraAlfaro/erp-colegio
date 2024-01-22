import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemuneracionesComponent } from './remuneraciones.component';

describe('RemuneracionesComponent', () => {
  let component: RemuneracionesComponent;
  let fixture: ComponentFixture<RemuneracionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemuneracionesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RemuneracionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
