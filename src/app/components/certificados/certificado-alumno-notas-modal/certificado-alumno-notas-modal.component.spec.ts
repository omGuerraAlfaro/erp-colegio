import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificadoAlumnoNotasModalComponent } from './certificado-alumno-notas-modal.component';

describe('CertificadoAlumnoNotasModalComponent', () => {
  let component: CertificadoAlumnoNotasModalComponent;
  let fixture: ComponentFixture<CertificadoAlumnoNotasModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CertificadoAlumnoNotasModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CertificadoAlumnoNotasModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
