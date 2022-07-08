import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorRangeMinMaxSelectorComponent } from './color-range-min-max-selector.component';

describe('ColorRangeMinMaxSelectorComponent', () => {
  let component: ColorRangeMinMaxSelectorComponent;
  let fixture: ComponentFixture<ColorRangeMinMaxSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColorRangeMinMaxSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorRangeMinMaxSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
