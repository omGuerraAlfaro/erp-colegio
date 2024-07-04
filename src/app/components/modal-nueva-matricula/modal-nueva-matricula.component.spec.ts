import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNuevaMatriculaComponent } from './modal-nueva-matricula.component';

describe('ModalNuevaMatriculaComponent', () => {
  let component: ModalNuevaMatriculaComponent;
  let fixture: ComponentFixture<ModalNuevaMatriculaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalNuevaMatriculaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalNuevaMatriculaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
