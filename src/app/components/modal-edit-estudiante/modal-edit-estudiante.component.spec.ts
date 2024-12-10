import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditEstudianteComponent } from './modal-edit-estudiante.component';

describe('ModalEditEstudianteComponent', () => {
  let component: ModalEditEstudianteComponent;
  let fixture: ComponentFixture<ModalEditEstudianteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalEditEstudianteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalEditEstudianteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
