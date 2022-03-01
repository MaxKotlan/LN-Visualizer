import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelColorDropdownComponent } from './channel-color-dropdown.component';

describe('ChannelColorDropdownComponent', () => {
  let component: ChannelColorDropdownComponent;
  let fixture: ComponentFixture<ChannelColorDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChannelColorDropdownComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelColorDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
