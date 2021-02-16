import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrymeComponent } from './tryme.component';

describe('TrymeComponent', () => {
  let component: TrymeComponent;
  let fixture: ComponentFixture<TrymeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrymeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrymeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
