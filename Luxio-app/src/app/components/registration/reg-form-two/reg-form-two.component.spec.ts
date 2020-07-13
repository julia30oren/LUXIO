import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegFormTwoComponent } from './reg-form-two.component';

describe('RegFormTwoComponent', () => {
  let component: RegFormTwoComponent;
  let fixture: ComponentFixture<RegFormTwoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegFormTwoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegFormTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
