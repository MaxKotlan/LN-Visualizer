import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenavOpenButtonComponent } from './sidenav-open-button.component';

describe('SidenavOpenButtonComponent', () => {
  let component: SidenavOpenButtonComponent;
  let fixture: ComponentFixture<SidenavOpenButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidenavOpenButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidenavOpenButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
