import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBoletaComponent } from './edit-boleta.component';

describe('EditBoletaComponent', () => {
  let component: EditBoletaComponent;
  let fixture: ComponentFixture<EditBoletaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditBoletaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditBoletaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
