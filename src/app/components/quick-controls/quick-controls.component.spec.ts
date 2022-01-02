import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickControlsComponent } from './quick-controls.component';

describe('QuickControlsComponent', () => {
  let component: QuickControlsComponent;
  let fixture: ComponentFixture<QuickControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuickControlsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
