import { TestBed } from '@angular/core/testing';

import { CityNamesService } from './city-names.service';

describe('CityNamesService', () => {
  let service: CityNamesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CityNamesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
