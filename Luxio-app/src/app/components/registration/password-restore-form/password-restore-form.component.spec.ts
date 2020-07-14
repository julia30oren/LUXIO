import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordRestoreFormComponent } from './password-restore-form.component';

describe('PasswordRestoreFormComponent', () => {
  let component: PasswordRestoreFormComponent;
  let fixture: ComponentFixture<PasswordRestoreFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswordRestoreFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordRestoreFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
