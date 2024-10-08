import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalTerminarFormularioMatriculaComponent } from './modal-terminar-formulario-matricula.component';

describe('ModalTerminarFormularioMatriculaComponent', () => {
  let component: ModalTerminarFormularioMatriculaComponent;
  let fixture: ComponentFixture<ModalTerminarFormularioMatriculaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalTerminarFormularioMatriculaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalTerminarFormularioMatriculaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
