import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoletasComponent } from './boletas.component';

describe('BoletasComponent', () => {
  let component: BoletasComponent;
  let fixture: ComponentFixture<BoletasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoletasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoletasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
