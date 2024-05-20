import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDetalleBoletaComponent } from './modal-detalle-boleta.component';

describe('ModalDetalleBoletaComponent', () => {
  let component: ModalDetalleBoletaComponent;
  let fixture: ComponentFixture<ModalDetalleBoletaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalDetalleBoletaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalDetalleBoletaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
