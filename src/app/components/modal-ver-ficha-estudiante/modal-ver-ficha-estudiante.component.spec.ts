import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalVerFichaEstudianteComponent } from './modal-ver-ficha-estudiante.component';

describe('ModalVerFichaEstudianteComponent', () => {
  let component: ModalVerFichaEstudianteComponent;
  let fixture: ComponentFixture<ModalVerFichaEstudianteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalVerFichaEstudianteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalVerFichaEstudianteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
