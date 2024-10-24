import { TestBed } from '@angular/core/testing';

import { CarparkCitiesDataResolverService } from './carpark-cities-data-resolver.service';

describe('CarparkCitiesDataResolverService', () => {
  let service: CarparkCitiesDataResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarparkCitiesDataResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
