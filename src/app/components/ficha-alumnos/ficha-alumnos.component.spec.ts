import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichaAlumnosComponent } from './ficha-alumnos.component';

describe('FichaAlumnosComponent', () => {
  let component: FichaAlumnosComponent;
  let fixture: ComponentFixture<FichaAlumnosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FichaAlumnosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FichaAlumnosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
