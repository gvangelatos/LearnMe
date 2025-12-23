import { TestBed } from '@angular/core/testing';

import { GsApiService } from './gs-api.service';

describe('GsApi', () => {
  let service: GsApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GsApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
