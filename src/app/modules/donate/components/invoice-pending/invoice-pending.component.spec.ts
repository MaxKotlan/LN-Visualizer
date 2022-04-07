import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicePendingComponent } from './invoice-pending.component';

describe('InvoicePendingComponent', () => {
  let component: InvoicePendingComponent;
  let fixture: ComponentFixture<InvoicePendingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoicePendingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoicePendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
