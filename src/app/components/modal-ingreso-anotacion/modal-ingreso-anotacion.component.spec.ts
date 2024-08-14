import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalIngresoAnotacionComponent } from './modal-ingreso-anotacion.component';

describe('ModalIngresoAnotacionComponent', () => {
  let component: ModalIngresoAnotacionComponent;
  let fixture: ComponentFixture<ModalIngresoAnotacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalIngresoAnotacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalIngresoAnotacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
