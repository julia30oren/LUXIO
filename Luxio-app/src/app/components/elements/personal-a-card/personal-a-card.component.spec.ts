import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalACardComponent } from './personal-a-card.component';

describe('PersonalACardComponent', () => {
  let component: PersonalACardComponent;
  let fixture: ComponentFixture<PersonalACardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalACardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalACardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
