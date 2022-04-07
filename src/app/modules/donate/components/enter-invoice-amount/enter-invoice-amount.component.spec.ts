import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterInvoiceAmountComponent } from './enter-invoice-amount.component';

describe('EnterInvoiceAmountComponent', () => {
  let component: EnterInvoiceAmountComponent;
  let fixture: ComponentFixture<EnterInvoiceAmountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnterInvoiceAmountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterInvoiceAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
