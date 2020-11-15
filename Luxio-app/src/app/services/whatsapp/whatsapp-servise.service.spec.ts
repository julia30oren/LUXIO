import { TestBed } from '@angular/core/testing';

import { WhatsappServiseService } from './whatsapp-servise.service';

describe('WhatsappServiseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WhatsappServiseService = TestBed.get(WhatsappServiseService);
    expect(service).toBeTruthy();
  });
});
