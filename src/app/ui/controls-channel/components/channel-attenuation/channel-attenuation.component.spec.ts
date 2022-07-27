import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelAttenuationComponent } from './channel-attenuation.component';

describe('ChannelAttenuationComponent', () => {
  let component: ChannelAttenuationComponent;
  let fixture: ComponentFixture<ChannelAttenuationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChannelAttenuationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelAttenuationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
