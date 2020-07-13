import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegFormOneComponent } from './reg-form-one.component';

describe('RegFormOneComponent', () => {
  let component: RegFormOneComponent;
  let fixture: ComponentFixture<RegFormOneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegFormOneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegFormOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
