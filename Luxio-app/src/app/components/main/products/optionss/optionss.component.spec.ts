import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionssComponent } from './optionss.component';

describe('OptionssComponent', () => {
  let component: OptionssComponent;
  let fixture: ComponentFixture<OptionssComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptionssComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionssComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
