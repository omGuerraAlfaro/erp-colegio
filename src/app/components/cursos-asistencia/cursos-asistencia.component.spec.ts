import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CursosAsistenciaComponent } from './cursos-asistencia.component';

describe('CursosAsistenciaComponent', () => {
  let component: CursosAsistenciaComponent;
  let fixture: ComponentFixture<CursosAsistenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CursosAsistenciaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CursosAsistenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
