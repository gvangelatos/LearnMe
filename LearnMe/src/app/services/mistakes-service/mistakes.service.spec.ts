import { TestBed } from '@angular/core/testing';

import { MistakesService } from './mistakes.service';

describe('MistakesService', () => {
  let service: MistakesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MistakesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
