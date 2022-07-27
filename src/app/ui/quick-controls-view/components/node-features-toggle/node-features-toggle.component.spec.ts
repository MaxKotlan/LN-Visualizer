import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeFeaturesToggleComponent } from './node-features-toggle.component';

describe('NodeFeaturesToggleComponent', () => {
  let component: NodeFeaturesToggleComponent;
  let fixture: ComponentFixture<NodeFeaturesToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NodeFeaturesToggleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeFeaturesToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
