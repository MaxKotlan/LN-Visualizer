import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonateBtcpayComponent } from './donate-btcpay.component';

describe('DonateBtcpayComponent', () => {
  let component: DonateBtcpayComponent;
  let fixture: ComponentFixture<DonateBtcpayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DonateBtcpayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DonateBtcpayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
