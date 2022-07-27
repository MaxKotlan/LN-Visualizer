import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsButtonComponent } from './stats-button.component';

describe('StatsButtonComponent', () => {
  let component: StatsButtonComponent;
  let fixture: ComponentFixture<StatsButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatsButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatsButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
