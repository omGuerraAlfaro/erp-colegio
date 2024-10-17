import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoletasMantenedorComponent } from './boletas-mantenedor.component';

describe('BoletasMantenedorComponent', () => {
  let component: BoletasMantenedorComponent;
  let fixture: ComponentFixture<BoletasMantenedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoletasMantenedorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoletasMantenedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
