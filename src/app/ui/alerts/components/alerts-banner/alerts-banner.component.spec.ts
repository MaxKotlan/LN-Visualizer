import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertsBannerComponent } from './alerts-banner.component';

describe('AlertsBannerComponent', () => {
  let component: AlertsBannerComponent;
  let fixture: ComponentFixture<AlertsBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlertsBannerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertsBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
