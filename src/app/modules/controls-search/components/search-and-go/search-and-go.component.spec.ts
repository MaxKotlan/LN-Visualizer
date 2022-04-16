import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchAndGoComponent } from './search-and-go.component';

describe('SearchAndGoComponent', () => {
  let component: SearchAndGoComponent;
  let fixture: ComponentFixture<SearchAndGoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchAndGoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchAndGoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
