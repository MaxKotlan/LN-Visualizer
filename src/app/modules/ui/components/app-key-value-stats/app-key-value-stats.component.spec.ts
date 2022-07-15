import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppKeyValueStatsComponent } from './app-key-value-stats.component';

describe('AppKeyValueStatsComponent', () => {
  let component: AppKeyValueStatsComponent;
  let fixture: ComponentFixture<AppKeyValueStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppKeyValueStatsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppKeyValueStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
