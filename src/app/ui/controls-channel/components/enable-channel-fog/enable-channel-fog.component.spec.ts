import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnableChannelFogComponent } from './enable-channel-fog.component';

describe('EnableChannelFogComponent', () => {
  let component: EnableChannelFogComponent;
  let fixture: ComponentFixture<EnableChannelFogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnableChannelFogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnableChannelFogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
