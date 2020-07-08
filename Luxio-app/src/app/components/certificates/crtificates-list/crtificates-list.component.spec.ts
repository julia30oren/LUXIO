import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrtificatesListComponent } from './crtificates-list.component';

describe('CrtificatesListComponent', () => {
  let component: CrtificatesListComponent;
  let fixture: ComponentFixture<CrtificatesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrtificatesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrtificatesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
