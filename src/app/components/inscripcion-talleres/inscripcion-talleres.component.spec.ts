import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InscripcionTalleresComponent } from './inscripcion-talleres.component';

describe('InscripcionTalleresComponent', () => {
  let component: InscripcionTalleresComponent;
  let fixture: ComponentFixture<InscripcionTalleresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InscripcionTalleresComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InscripcionTalleresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
