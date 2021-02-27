import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaypaltestComponent } from './paypaltest.component';

describe('PaypaltestComponent', () => {
  let component: PaypaltestComponent;
  let fixture: ComponentFixture<PaypaltestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaypaltestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaypaltestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
