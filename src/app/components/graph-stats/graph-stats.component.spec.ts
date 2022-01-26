import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphStatsComponent } from './graph-stats.component';

describe('GraphStatsComponent', () => {
  let component: GraphStatsComponent;
  let fixture: ComponentFixture<GraphStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphStatsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
