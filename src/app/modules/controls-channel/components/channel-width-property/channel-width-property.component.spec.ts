import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelWidthPropertyComponent } from './channel-width-property.component';

describe('ChannelWidthPropertyComponent', () => {
  let component: ChannelWidthPropertyComponent;
  let fixture: ComponentFixture<ChannelWidthPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChannelWidthPropertyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelWidthPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
