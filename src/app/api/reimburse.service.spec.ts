import { TestBed } from '@angular/core/testing';

import { ReimburseService } from './reimburse.service';

describe('ReimburseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReimburseService = TestBed.get(ReimburseService);
    expect(service).toBeTruthy();
  });
});
