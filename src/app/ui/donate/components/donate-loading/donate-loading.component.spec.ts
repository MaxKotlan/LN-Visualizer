import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonateLoadingComponent } from './donate-loading.component';

describe('DonateLoadingComponent', () => {
  let component: DonateLoadingComponent;
  let fixture: ComponentFixture<DonateLoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DonateLoadingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DonateLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
