import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GelPlayComponent } from './gel-play.component';

describe('GelPlayComponent', () => {
  let component: GelPlayComponent;
  let fixture: ComponentFixture<GelPlayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GelPlayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GelPlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
