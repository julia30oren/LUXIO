import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrtificateUploadComponent } from './crtificate-upload.component';

describe('CrtificateUploadComponent', () => {
  let component: CrtificateUploadComponent;
  let fixture: ComponentFixture<CrtificateUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrtificateUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrtificateUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
