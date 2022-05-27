import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayUnitSelectorComponent } from './display-unit-selector.component';

describe('DisplayUnitSelectorComponent', () => {
  let component: DisplayUnitSelectorComponent;
  let fixture: ComponentFixture<DisplayUnitSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayUnitSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayUnitSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
