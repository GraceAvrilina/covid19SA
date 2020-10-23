import { TestBed } from '@angular/core/testing';

import { PerjalananDinasService } from './perjalanan-dinas.service';

describe('PerjalananDinasService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PerjalananDinasService = TestBed.get(PerjalananDinasService);
    expect(service).toBeTruthy();
  });
});
