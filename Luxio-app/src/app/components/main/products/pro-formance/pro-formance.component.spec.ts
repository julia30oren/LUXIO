import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProFormanceComponent } from './pro-formance.component';

describe('ProFormanceComponent', () => {
  let component: ProFormanceComponent;
  let fixture: ComponentFixture<ProFormanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProFormanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProFormanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
