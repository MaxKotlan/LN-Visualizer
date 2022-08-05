import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorScaleSettingsModalComponent } from './color-scale-settings-modal.component';

describe('ColorScaleSettingsModalComponent', () => {
  let component: ColorScaleSettingsModalComponent;
  let fixture: ComponentFixture<ColorScaleSettingsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColorScaleSettingsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorScaleSettingsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
