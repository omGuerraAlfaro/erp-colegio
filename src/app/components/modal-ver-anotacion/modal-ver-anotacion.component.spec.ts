import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalVerAnotacionComponent } from './modal-ver-anotacion.component';

describe('ModalVerAnotacionComponent', () => {
  let component: ModalVerAnotacionComponent;
  let fixture: ComponentFixture<ModalVerAnotacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalVerAnotacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalVerAnotacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
