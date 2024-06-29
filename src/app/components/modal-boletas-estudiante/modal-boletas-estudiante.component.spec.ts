import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalBoletasEstudianteComponent } from './modal-boletas-estudiante.component';

describe('ModalBoletasEstudianteComponent', () => {
  let component: ModalBoletasEstudianteComponent;
  let fixture: ComponentFixture<ModalBoletasEstudianteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalBoletasEstudianteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalBoletasEstudianteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
