import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegFormAgreementComponent } from './reg-form-agreement.component';

describe('RegFormAgreementComponent', () => {
  let component: RegFormAgreementComponent;
  let fixture: ComponentFixture<RegFormAgreementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegFormAgreementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegFormAgreementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
