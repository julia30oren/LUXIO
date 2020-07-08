import { TestBed } from '@angular/core/testing';

import { ImgSearviceService } from './img-searvice.service';

describe('ImgSearviceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ImgSearviceService = TestBed.get(ImgSearviceService);
    expect(service).toBeTruthy();
  });
});
