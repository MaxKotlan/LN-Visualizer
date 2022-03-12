import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickCapacityComponent } from './quick-capacity.component';

describe('QuickCapacityComponent', () => {
  let component: QuickCapacityComponent;
  let fixture: ComponentFixture<QuickCapacityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuickCapacityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickCapacityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
