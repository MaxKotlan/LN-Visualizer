import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomMeshTestComponent } from './custom-mesh-test.component';

describe('CustomMeshTestComponent', () => {
  let component: CustomMeshTestComponent;
  let fixture: ComponentFixture<CustomMeshTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomMeshTestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomMeshTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
