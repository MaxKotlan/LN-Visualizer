import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickControlsViewComponent } from './quick-controls-view.component';

describe('QuickControlsViewComponent', () => {
  let component: QuickControlsViewComponent;
  let fixture: ComponentFixture<QuickControlsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuickControlsViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickControlsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
