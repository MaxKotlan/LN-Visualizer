import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelWidthComponent } from './channel-width.component';

describe('ChannelWidthComponent', () => {
  let component: ChannelWidthComponent;
  let fixture: ComponentFixture<ChannelWidthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChannelWidthComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelWidthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
