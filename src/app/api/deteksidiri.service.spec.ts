import { TestBed } from '@angular/core/testing';

import { DeteksidiriService } from './deteksidiri.service';

describe('DeteksidiriService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DeteksidiriService = TestBed.get(DeteksidiriService);
    expect(service).toBeTruthy();
  });
});
