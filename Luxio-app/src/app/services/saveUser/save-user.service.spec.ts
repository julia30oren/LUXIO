import { TestBed } from '@angular/core/testing';

import { SaveUserService } from './save-user.service';

describe('SaveUserService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SaveUserService = TestBed.get(SaveUserService);
    expect(service).toBeTruthy();
  });
});
