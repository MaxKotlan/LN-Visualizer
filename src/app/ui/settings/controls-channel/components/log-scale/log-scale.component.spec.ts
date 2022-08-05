import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogScaleComponent } from './log-scale.component';

describe('LogScaleComponent', () => {
  let component: LogScaleComponent;
  let fixture: ComponentFixture<LogScaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogScaleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogScaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
