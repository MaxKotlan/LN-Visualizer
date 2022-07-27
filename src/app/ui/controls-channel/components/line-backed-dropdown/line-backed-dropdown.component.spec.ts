import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineBackedDropdownComponent } from './line-backed-dropdown.component';

describe('LineBackedDropdownComponent', () => {
  let component: LineBackedDropdownComponent;
  let fixture: ComponentFixture<LineBackedDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LineBackedDropdownComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LineBackedDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
