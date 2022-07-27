import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PilotFlagModalComponent } from './pilot-flag-modal.component';

describe('PilotFlagModalComponent', () => {
  let component: PilotFlagModalComponent;
  let fixture: ComponentFixture<PilotFlagModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PilotFlagModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PilotFlagModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
