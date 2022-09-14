import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrictPolicyFiltersComponent } from './strict-policy-filters.component';

describe('StrictPolicyFiltersComponent', () => {
  let component: StrictPolicyFiltersComponent;
  let fixture: ComponentFixture<StrictPolicyFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrictPolicyFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrictPolicyFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
