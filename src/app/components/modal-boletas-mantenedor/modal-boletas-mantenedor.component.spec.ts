import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalBoletasMantenedorComponent } from './modal-boletas-mantenedor.component';

describe('ModalBoletasMantenedorComponent', () => {
  let component: ModalBoletasMantenedorComponent;
  let fixture: ComponentFixture<ModalBoletasMantenedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalBoletasMantenedorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalBoletasMantenedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
