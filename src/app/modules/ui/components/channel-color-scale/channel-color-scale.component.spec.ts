import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelColorScaleComponent } from './channel-color-scale.component';

describe('ChannelColorScaleComponent', () => {
  let component: ChannelColorScaleComponent;
  let fixture: ComponentFixture<ChannelColorScaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChannelColorScaleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelColorScaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
