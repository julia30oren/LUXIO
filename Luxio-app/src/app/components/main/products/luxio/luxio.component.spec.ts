import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LuxioComponent } from './luxio.component';

describe('LuxioComponent', () => {
  let component: LuxioComponent;
  let fixture: ComponentFixture<LuxioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LuxioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LuxioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
