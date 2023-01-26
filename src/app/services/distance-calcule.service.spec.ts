import { TestBed } from '@angular/core/testing';

import { DistanceCalculeService } from './distance-calcule.service';

describe('DistanceCalculeService', () => {
  let service: DistanceCalculeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DistanceCalculeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
