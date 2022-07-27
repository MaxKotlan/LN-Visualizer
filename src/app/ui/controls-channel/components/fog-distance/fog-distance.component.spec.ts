import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FogDistanceComponent } from './fog-distance.component';

describe('FogDistanceComponent', () => {
  let component: FogDistanceComponent;
  let fixture: ComponentFixture<FogDistanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FogDistanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FogDistanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
