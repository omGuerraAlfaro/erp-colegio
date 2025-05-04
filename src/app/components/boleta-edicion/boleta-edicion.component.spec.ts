import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoletaEdicionComponent } from './boleta-edicion.component';

describe('BoletaEdicionComponent', () => {
  let component: BoletaEdicionComponent;
  let fixture: ComponentFixture<BoletaEdicionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoletaEdicionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoletaEdicionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
