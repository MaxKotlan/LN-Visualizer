import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilteredGraphStatsComponent } from './filtered-graph-stats.component';

describe('FilteredGraphStatsComponent', () => {
  let component: FilteredGraphStatsComponent;
  let fixture: ComponentFixture<FilteredGraphStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilteredGraphStatsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilteredGraphStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
