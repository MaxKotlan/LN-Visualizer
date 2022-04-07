import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceErrorComponent } from './invoice-error.component';

describe('InvoiceErrorComponent', () => {
  let component: InvoiceErrorComponent;
  let fixture: ComponentFixture<InvoiceErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoiceErrorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
