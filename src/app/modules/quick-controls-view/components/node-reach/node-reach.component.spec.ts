import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeReachComponent } from './node-reach.component';

describe('NodeReachComponent', () => {
  let component: NodeReachComponent;
  let fixture: ComponentFixture<NodeReachComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NodeReachComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NodeReachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
