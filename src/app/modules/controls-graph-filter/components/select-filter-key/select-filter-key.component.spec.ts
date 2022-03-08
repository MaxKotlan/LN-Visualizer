import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectFilterKeyComponent } from './select-filter-key.component';

describe('SelectFilterKeyComponent', () => {
  let component: SelectFilterKeyComponent;
  let fixture: ComponentFixture<SelectFilterKeyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectFilterKeyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectFilterKeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
