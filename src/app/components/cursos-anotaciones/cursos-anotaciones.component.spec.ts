import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CursosAnotacionesComponent } from './cursos-anotaciones.component';

describe('CursosComponent', () => {
  let component: CursosAnotacionesComponent;
  let fixture: ComponentFixture<CursosAnotacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CursosAnotacionesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CursosAnotacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
