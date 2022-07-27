import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowDonateLinkCheckboxComponent } from './show-donate-link-checkbox.component';

describe('ShowDonateLinkCheckboxComponent', () => {
  let component: ShowDonateLinkCheckboxComponent;
  let fixture: ComponentFixture<ShowDonateLinkCheckboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowDonateLinkCheckboxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowDonateLinkCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
