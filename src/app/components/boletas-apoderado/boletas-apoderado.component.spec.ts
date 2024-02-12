import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoletasApoderadoComponent } from './boletas-apoderado.component';

describe('BoletasApoderadoComponent', () => {
  let component: BoletasApoderadoComponent;
  let fixture: ComponentFixture<BoletasApoderadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoletasApoderadoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoletasApoderadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
