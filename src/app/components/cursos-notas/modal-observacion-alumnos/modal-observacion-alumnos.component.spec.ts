import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalObservacionAlumnosComponent } from './modal-observacion-alumnos.component';

describe('ModalObservacionAlumnosComponent', () => {
  let component: ModalObservacionAlumnosComponent;
  let fixture: ComponentFixture<ModalObservacionAlumnosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalObservacionAlumnosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalObservacionAlumnosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
