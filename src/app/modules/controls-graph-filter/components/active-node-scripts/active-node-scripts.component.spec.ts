import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveNodeScriptsComponent } from './active-node-scripts.component';

describe('ActiveNodeScriptsComponent', () => {
  let component: ActiveNodeScriptsComponent;
  let fixture: ComponentFixture<ActiveNodeScriptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActiveNodeScriptsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveNodeScriptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
