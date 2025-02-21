import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalIngresarMatriculaComponent } from './modal-ingresar-matricula-apoderado-exist.component';

describe('ModalIngresarMatriculaComponent', () => {
  let component: ModalIngresarMatriculaComponent;
  let fixture: ComponentFixture<ModalIngresarMatriculaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalIngresarMatriculaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalIngresarMatriculaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
