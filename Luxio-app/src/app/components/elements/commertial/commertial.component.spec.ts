import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommertialComponent } from './commertial.component';

describe('CommertialComponent', () => {
  let component: CommertialComponent;
  let fixture: ComponentFixture<CommertialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommertialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommertialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
