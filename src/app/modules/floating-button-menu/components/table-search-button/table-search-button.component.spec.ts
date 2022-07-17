import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableSearchButtonComponent } from './table-search-button.component';

describe('TableSearchButtonComponent', () => {
  let component: TableSearchButtonComponent;
  let fixture: ComponentFixture<TableSearchButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableSearchButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableSearchButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
