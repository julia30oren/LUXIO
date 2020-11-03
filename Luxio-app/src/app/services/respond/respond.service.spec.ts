import { TestBed } from '@angular/core/testing';

import { RespondService } from './respond.service';

describe('RespondService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RespondService = TestBed.get(RespondService);
    expect(service).toBeTruthy();
  });
});
