import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniInputComponent } from './mini-input.component';

describe('MiniInputComponent', () => {
  let component: MiniInputComponent;
  let fixture: ComponentFixture<MiniInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiniInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MiniInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
