import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClearnetOnionToggleComponent } from './clearnet-onion-toggle.component';

describe('ClearnetOnionToggleComponent', () => {
  let component: ClearnetOnionToggleComponent;
  let fixture: ComponentFixture<ClearnetOnionToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClearnetOnionToggleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClearnetOnionToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
