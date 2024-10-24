import { TestBed } from '@angular/core/testing';

import { CarparkDataService } from './carpark-data.service';

describe('CarparkDataService', () => {
  let service: CarparkDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarparkDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
