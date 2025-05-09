import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalVerBoletasComponent } from './modal-ver-boletas.component';

describe('ModalVerBoletasComponent', () => {
  let component: ModalVerBoletasComponent;
  let fixture: ComponentFixture<ModalVerBoletasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalVerBoletasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalVerBoletasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
