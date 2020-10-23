import { TestBed } from '@angular/core/testing';

import { LlsService } from './lls.service';

describe('LlsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LlsService = TestBed.get(LlsService);
    expect(service).toBeTruthy();
  });
});
