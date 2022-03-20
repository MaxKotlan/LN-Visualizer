import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickSliderComponent } from './quick-slider.component';

describe('QuickSliderComponent', () => {
  let component: QuickSliderComponent;
  let fixture: ComponentFixture<QuickSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuickSliderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
