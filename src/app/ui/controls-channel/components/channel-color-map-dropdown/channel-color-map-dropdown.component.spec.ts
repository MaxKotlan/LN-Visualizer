import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelColorMapDropdownComponent } from './channel-color-map-dropdown.component';

describe('ChannelColorMapDropdownComponent', () => {
  let component: ChannelColorMapDropdownComponent;
  let fixture: ComponentFixture<ChannelColorMapDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChannelColorMapDropdownComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelColorMapDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
